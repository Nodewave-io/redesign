#!/usr/bin/env node
// Redesign CLI. Thin wrapper over:
//   • the Next.js editor bundled in web/ (once ported)
//   • the MCP server at src/mcp/index.ts
//   • the SQLite DB at ~/.redesign/db.sqlite
//
// Commands:
//   redesign [--port 3000]          Start the local editor (default action)
//   redesign start [--port 3000]    Same as above, explicit
//   redesign mcp                    Run the stdio MCP server (Claude Code calls this)
//   redesign mcp-config             Print the .mcp.json snippet to stdout
//   redesign doctor                 Environment check (node version, sqlite, perms)
//   redesign reset [--yes]          Wipe ~/.redesign (asks unless --yes)
//   redesign --help / --version

import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { existsSync, realpathSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { createInterface } from 'node:readline/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { REDESIGN_HOME, DB_PATH, ensureDirs } from './db/paths.js'
import { closeDb, getDb } from './db/client.js'
import { writeConfig } from './config.js'
import { seedIcons } from './seed.js'

const VERSION = '0.3.2'

async function main(argv: string[]): Promise<number> {
  const [cmd, ...rest] = argv
  switch (cmd) {
    // No subcommand → start the editor. Mirrors `next`, `vite`, `claude`
    // and most modern dev CLIs. Use `redesign --help` for the command list.
    case undefined:
      return runStart(rest)
    case 'help':
    case '--help':
    case '-h':
      printHelp()
      return 0
    case 'version':
    case '--version':
    case '-v':
      console.log(VERSION)
      return 0
    case 'mcp':
      return runMcp()
    case 'mcp-config':
      printMcpConfig()
      return 0
    case 'connect':
      return runConnect()
    case 'install-mcp':
      // Back-compat alias from 0.2.x. Points at the same verified flow.
      return runConnect()
    case 'doctor':
      return runDoctor()
    case 'reset':
      return runReset(rest.includes('--yes') || rest.includes('-y'))
    case 'start':
      return runStart(rest)
    case 'init':
      return runInit()
    case 'seed':
      return runSeed(rest)
    case 'update':
    case 'upgrade':
      return runUpdate()
    default:
      console.error(`unknown command: ${cmd}`)
      printHelp()
      return 1
  }
}

function printHelp(): void {
  console.log(
    [
      `redesign ${VERSION}`,
      '',
      'USAGE',
      '  redesign                  Start the local editor (default action)',
      '  redesign <command> [options]',
      '',
      'COMMANDS',
      '  start [--port N]  Start the local editor (spawns Next on :N, default 3000)',
      '  mcp               Run the stdio MCP server (invoked by Claude Code)',
      '  mcp-config        Print the .mcp.json snippet for Claude Code',
      '  connect           Register the MCP with Claude Code and verify it boots',
      '  install-mcp       Alias for `connect` (older name, kept for back-compat)',
      '  init              Create ~/.redesign and bootstrap the SQLite schema',
      '  seed [dir]        Import a folder of TSX icons into the asset library',
      '                    (defaults to ./seed/icons; pass --replace to wipe first)',
      '  doctor            Check your environment is good to go',
      '  update            Upgrade to the latest version on npm',
      '  reset [--yes]     Wipe ~/.redesign (prompts unless --yes)',
      '  version           Print the version',
      '',
      `DATA DIR  ${REDESIGN_HOME}`,
    ].join('\n'),
  )
}

function printMcpConfig(): void {
  // Pasteable snippet. JSON, no trailing comma.
  const snippet = {
    mcpServers: {
      redesign: mcpEntry(),
    },
  }
  console.log(JSON.stringify(snippet, null, 2))
}

// Shape Claude Code expects for a user-scope stdio MCP entry in
// ~/.claude.json. `type:'stdio'` matches the schema it writes when
// you run `claude mcp add --scope user`.
type McpStdioEntry = {
  type: 'stdio'
  command: string
  args: string[]
  env: Record<string, string>
}

function mcpEntry(): McpStdioEntry {
  return {
    type: 'stdio',
    command: 'npx',
    args: ['-y', '@nodewave-io/redesign', 'mcp'],
    env: {},
  }
}

// Does the given entry already point at our CLI? We don't require an
// exact structural match because users may have written it by hand or
// via `claude mcp add` with slightly different args.
function entryLooksLikeRedesign(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false
  const e = v as { command?: unknown; args?: unknown }
  const args = Array.isArray(e.args) ? (e.args as unknown[]) : []
  const joined = args.map((a) => String(a)).join(' ')
  return (
    (e.command === 'npx' || e.command === 'redesign' || String(e.command ?? '').endsWith('/redesign')) &&
    (joined.includes('@nodewave-io/redesign') || args.includes('mcp'))
  )
}

// Write the redesign entry into ~/.claude.json (the file Claude Code
// actually reads at user scope — the legacy ~/.claude/mcp.json is no
// longer consulted). Preserves all other top-level keys and peer MCPs.
// Idempotent. Returns 'added' | 'updated' | 'already-present'.
async function ensureMcpInstalled(): Promise<
  | { status: 'added' | 'updated' | 'already-present'; path: string }
  | { status: 'error'; path: string; error: string }
> {
  const { readFile, writeFile, rename } = await import('node:fs/promises')
  const path = await import('node:path')
  const cfgPath = path.join(homedir(), '.claude.json')

  let existing: Record<string, unknown> = {}
  try {
    const raw = await readFile(cfgPath, 'utf-8')
    existing = JSON.parse(raw) as Record<string, unknown>
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code === 'ENOENT') {
      // File doesn't exist yet. We'll create it.
    } else if (err instanceof SyntaxError) {
      // Malformed JSON. Back up the original so the user can recover
      // whatever was there, then treat as empty so redesign's entry
      // still gets installed. Without this a single stray character in
      // ~/.claude.json would block every `redesign start` indefinitely.
      try {
        const backup = `${cfgPath}.corrupt.${Date.now()}`
        await rename(cfgPath, backup)
        console.error(
          `[redesign] ~/.claude.json was not valid JSON; backed up to ${backup} and creating a fresh one.`,
        )
      } catch {
        // If even the rename fails we still want to continue. The
        // atomic write below will overwrite the corrupt file.
      }
      existing = {}
    } else {
      return {
        status: 'error',
        path: cfgPath,
        error: (err as Error).message,
      }
    }
  }

  const servers = ((existing.mcpServers ?? {}) as Record<string, unknown>)
  const entry = mcpEntry()
  const prev = servers.redesign
  if (prev && entryLooksLikeRedesign(prev)) {
    // Already registered and points at us — leave it alone. This
    // handles users who installed via `claude mcp add` (slightly
    // different shape) without flipping the entry back and forth on
    // every `redesign` start.
    return { status: 'already-present', path: cfgPath }
  }
  const wasPresent = 'redesign' in servers
  servers.redesign = entry
  const next = { ...existing, mcpServers: servers }

  // Atomic write: tmp + rename so Claude Code never sees a half
  // written file. Keep mode 0600 — this file holds tokens/env for
  // other MCPs.
  const tmp = `${cfgPath}.tmp.${process.pid}`
  try {
    await writeFile(tmp, JSON.stringify(next, null, 2) + '\n', {
      encoding: 'utf-8',
      mode: 0o600,
    })
    await rename(tmp, cfgPath)
  } catch (err) {
    return {
      status: 'error',
      path: cfgPath,
      error: (err as Error).message,
    }
  }
  return { status: wasPresent ? 'updated' : 'added', path: cfgPath }
}

// Verified MCP installer. Writes the config, then actually boots the
// stdio server once to prove it responds. Catches the "Claude Code
// shows redesign as 'connecting' forever" class of failure at install
// time instead of leaving the user in a silent limbo.
//
// Flow:
//   1. Write the mcpServers entry — prefer `claude mcp add-json` when
//      the Claude Code CLI is on PATH (lets Claude Code own the
//      canonical format); fall back to hand-writing ~/.claude.json.
//   2. Spawn the local mcp entry (node dist/mcp/index.js) and wait up
//      to 5s for `[redesign-mcp] stdio ready` on stderr. If the
//      process dies before printing that line, the MCP is broken and
//      Claude Code would never see it. Surface the failure here.
//   3. Print next-step diagnostics.
async function runConnect(): Promise<number> {
  console.log('')
  const writeRes = await writeMcpEntry()
  if (writeRes.status === 'error') {
    console.error(`[redesign] couldn't register MCP: ${writeRes.error}`)
    console.error(
      `[redesign] paste the snippet manually with: redesign mcp-config`,
    )
    return 1
  }
  if (writeRes.status === 'already-present') {
    console.log(`  ✓ 'redesign' already registered in ${writeRes.path}`)
  } else if (writeRes.status === 'updated') {
    console.log(`  ✓ Updated 'redesign' entry in ${writeRes.path}`)
  } else {
    console.log(`  ✓ Added 'redesign' entry to ${writeRes.path}`)
  }
  if (writeRes.via) console.log(`    (via ${writeRes.via})`)

  // Verify the MCP stdio server actually boots. Spawning the local
  // dist entry (not `npx`) avoids npm resolution latency and tests the
  // exact code Claude Code will run via `npx -y @nodewave-io/redesign
  // mcp`. A failure here = Claude Code would never see tools either.
  console.log('')
  console.log('  Verifying MCP stdio server boots …')
  const probeRes = await probeMcpStdio()
  if (!probeRes.ok) {
    console.error(`  ✗ MCP boot failed: ${probeRes.reason}`)
    if (probeRes.stderr) {
      console.error('    --- subprocess stderr ---')
      for (const line of probeRes.stderr.trim().split('\n').slice(-10)) {
        console.error(`    ${line}`)
      }
    }
    console.error('')
    console.error(
      '  Claude Code would also fail to connect to this MCP. Fix the',
    )
    console.error(
      '  error above, then run `redesign connect` again. If you are stuck,',
    )
    console.error(
      '  run `npx @nodewave-io/redesign doctor` and report the output.',
    )
    return 1
  }
  console.log('  ✓ MCP handshake completed (stdio ready)')

  console.log('')
  console.log('  Next:')
  console.log('    1. Restart Claude Code so it picks up the new MCP.')
  console.log('    2. In any session, run `/mcp` or `claude mcp list`.')
  console.log('       You should see `redesign: connected`.')
  console.log('    3. Ask Claude to "make a 5-slide carousel" and watch it work.')
  console.log('')
  return 0
}

// Try `claude mcp add-json` first. It's Claude Code's own canonical
// writer, so we delegate format ownership. Fall back to the
// hand-written ~/.claude.json path when the CLI isn't on PATH (rare
// but possible — user installed the desktop app only, or the shim
// hasn't been symlinked yet).
type WriteRes =
  | { status: 'added' | 'updated' | 'already-present'; path: string; via?: string }
  | { status: 'error'; path: string; error: string; via?: string }

async function writeMcpEntry(): Promise<WriteRes> {
  const claudePath = await whichClaudeCli()
  if (claudePath) {
    const res = await writeViaClaudeCli(claudePath)
    if (res) return res
    // claude CLI was present but the call failed for a non-syntax
    // reason; fall through to the hand-written path as a safety net.
  }
  const res = await ensureMcpInstalled()
  return { ...res, via: `wrote ~/.claude.json directly` }
}

async function whichClaudeCli(): Promise<string | null> {
  const { spawn } = await import('node:child_process')
  const probeCmd = process.platform === 'win32' ? 'where' : 'which'
  return new Promise<string | null>((resolve) => {
    const p = spawn(probeCmd, ['claude'], { stdio: ['ignore', 'pipe', 'ignore'] })
    let out = ''
    p.stdout.on('data', (b: Buffer) => { out += b.toString() })
    p.on('error', () => resolve(null))
    p.on('exit', (code) => {
      if (code === 0 && out.trim()) resolve(out.trim().split(/\r?\n/)[0] ?? null)
      else resolve(null)
    })
  })
}

async function writeViaClaudeCli(claudePath: string): Promise<WriteRes | null> {
  const { spawn } = await import('node:child_process')
  const entry = mcpEntry()
  const json = JSON.stringify(entry)
  return new Promise<WriteRes | null>((resolve) => {
    // `claude mcp add-json <name> <json>` with --scope user. We pass
    // the JSON as a single argv slot (no shell interpolation), which
    // is cross-platform and handles any quoting weirdness for free.
    const args = ['mcp', 'add-json', '--scope', 'user', 'redesign', json]
    const p = spawn(claudePath, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    p.stdout.on('data', (b: Buffer) => { stdout += b.toString() })
    p.stderr.on('data', (b: Buffer) => { stderr += b.toString() })
    p.on('error', () => resolve(null))
    p.on('exit', (code) => {
      const cfgPath = `${process.env.HOME ?? ''}/.claude.json`
      if (code === 0) {
        const updated = /updated|already/i.test(stdout + stderr)
        resolve({
          status: updated ? 'updated' : 'added',
          path: cfgPath,
          via: 'claude mcp add-json',
        })
      } else {
        // Treat any non-zero as "fall back". This covers both the
        // "already registered" case (some versions exit non-zero for
        // that) and genuine errors. The hand-written path will
        // short-circuit on already-present anyway.
        resolve(null)
      }
    })
  })
}

async function probeMcpStdio(): Promise<{ ok: true } | { ok: false; reason: string; stderr?: string }> {
  const { spawn } = await import('node:child_process')
  const here = dirname(fileURLToPath(import.meta.url))
  const mcpEntryPath = join(here, 'mcp', 'index.js')
  if (!existsSync(mcpEntryPath)) {
    return { ok: false, reason: `mcp entry missing at ${mcpEntryPath} (stale build?)` }
  }
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, [mcpEntryPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    })
    let stderrBuf = ''
    let settled = false
    const done = (res: { ok: true } | { ok: false; reason: string; stderr?: string }) => {
      if (settled) return
      settled = true
      // Close stdin so the server exits cleanly (the server holds the
      // process open until stdin closes, per run() in mcp/index.ts).
      try { proc.stdin.end() } catch {/* already closed */}
      setTimeout(() => {
        try { proc.kill('SIGTERM') } catch {/* gone */}
      }, 500)
      resolve(res)
    }
    const timer = setTimeout(() => {
      done({
        ok: false,
        reason: 'timed out after 5s waiting for [redesign-mcp] stdio ready',
        stderr: stderrBuf,
      })
    }, 5000)
    proc.stderr.on('data', (b: Buffer) => {
      stderrBuf += b.toString()
      if (stderrBuf.includes('[redesign-mcp] stdio ready')) {
        clearTimeout(timer)
        done({ ok: true })
      }
    })
    proc.on('error', (err) => {
      clearTimeout(timer)
      done({ ok: false, reason: (err as Error).message, stderr: stderrBuf })
    })
    proc.on('exit', (code, signal) => {
      clearTimeout(timer)
      if (!settled) {
        done({
          ok: false,
          reason: `subprocess exited before handshake (code=${code}, signal=${signal ?? 'none'})`,
          stderr: stderrBuf,
        })
      }
    })
  })
}

async function runMcp(): Promise<number> {
  // Defer to the stdio server entry. It registers all tools, connects
  // the transport, and holds the process open until Claude Code
  // disconnects. We must AWAIT the exported `run()` — the module's
  // top-level only kicks off the async main; if we return before
  // stdin closes, the CLI's `process.exit(0)` would kill the server
  // right after it emits "stdio ready".
  const modPath = new URL('./mcp/index.js', import.meta.url)
  const mod = (await import(modPath.href)) as { run: () => Promise<void> }
  if (typeof mod.run !== 'function') {
    console.error('[redesign] mcp/index.js missing run() export (stale build?)')
    return 1
  }
  await mod.run()
  return 0
}

async function runDoctor(): Promise<number> {
  let ok = true
  const tick = (label: string, good: boolean, detail = ''): void => {
    console.log(`  ${good ? '✓' : '✗'} ${label}${detail ? `: ${detail}` : ''}`)
    if (!good) ok = false
  }
  const nodeMajor = Number(process.versions.node.split('.')[0])
  tick(`Node >= 20 (have ${process.versions.node})`, nodeMajor >= 20)
  try {
    ensureDirs()
    tick(`Data dir writable (${REDESIGN_HOME})`, true)
  } catch (err) {
    tick(
      `Data dir writable (${REDESIGN_HOME})`,
      false,
      err instanceof Error ? err.message : String(err),
    )
  }
  try {
    const db = getDb()
    const tables = db
      .prepare<[], { name: string }>(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
      )
      .all()
    tick(`SQLite + schema (${tables.length} tables)`, tables.length >= 4)
    closeDb()
  } catch (err) {
    tick(
      'SQLite + schema',
      false,
      err instanceof Error ? err.message : String(err),
    )
  }
  console.log('')
  console.log(ok ? 'All checks passed.' : 'Some checks failed. See above.')
  return ok ? 0 : 1
}

async function runReset(skipConfirm: boolean): Promise<number> {
  if (!existsSync(REDESIGN_HOME)) {
    console.log(`Nothing to delete. ${REDESIGN_HOME} does not exist.`)
    return 0
  }
  if (!skipConfirm) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    const answer = await rl.question(
      `This will permanently delete ${REDESIGN_HOME} and all your posts + assets. Type 'yes' to confirm: `,
    )
    rl.close()
    if (answer.trim().toLowerCase() !== 'yes') {
      console.log('Aborted.')
      return 1
    }
  }
  closeDb() // release the sqlite handle before unlinking
  rmSync(REDESIGN_HOME, { recursive: true, force: true })
  console.log(`Deleted ${REDESIGN_HOME}`)
  return 0
}

async function runSeed(args: string[]): Promise<number> {
  const replace = args.includes('--replace') || args.includes('-r')
  const positional = args.filter((a) => !a.startsWith('-'))
  // Default to ./seed/icons in the package root (works both in dev
  // and in the published tarball where seed/ ships alongside dist/).
  const here = dirname(fileURLToPath(import.meta.url))
  const defaultRoot = locateSeedDir(here)
  const root = positional[0] ?? defaultRoot
  if (!root || !existsSync(root)) {
    if (!positional[0]) {
      console.error(
        '[redesign] no seed directory was given and none is bundled with this release.',
      )
      console.error(
        'Pass a path to a folder of TSX components or icons, e.g.',
      )
      console.error('  redesign seed ~/Downloads/my-icons')
    } else {
      console.error(`[redesign] seed dir not found: ${root}`)
    }
    return 1
  }

  // Bootstrap DB before importing so first-run users don't hit a
  // schema-missing error.
  getDb()
  let lastPct = -1
  try {
    const res = seedIcons({
      root,
      replace,
      onProgress: (kind, name, i, total) => {
        const pct = Math.floor((i / total) * 100)
        if (pct !== lastPct && pct % 10 === 0) {
          console.error(`[redesign] ${pct}%: ${i}/${total} (${name})`)
          lastPct = pct
        }
        if (kind === 'replaced') {
          // Replacements are rare; worth calling out.
          console.error(`[redesign] replaced ${name}`)
        }
      },
    })
    console.error('')
    console.error(`[redesign] imported ${res.added} icon(s) from ${root}`)
    if (res.skipped) console.error(`[redesign] skipped ${res.skipped} (already in library; pass --replace to overwrite)`)
    if (res.replaced) console.error(`[redesign] replaced ${res.replaced}`)
    return 0
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`[redesign] seed failed: ${msg}`)
    return 1
  } finally {
    closeDb()
  }
}

// Walk up from the CLI file to find a sibling `seed/icons` folder.
// Layout in dev: <root>/src/cli.ts + <root>/seed/icons/.
// Layout in tarball: <root>/dist/cli.js + <root>/seed/icons/.
function locateSeedDir(start: string): string | null {
  let dir = start
  for (let i = 0; i < 5; i++) {
    const candidate = join(dir, 'seed', 'icons')
    if (existsSync(candidate)) return candidate
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

async function runInit(): Promise<number> {
  getDb() // bootstrap schema
  closeDb()
  console.log(`Initialized ${DB_PATH}`)
  return 0
}

// Upgrades the global install to whatever's tagged `latest` on npm.
// Wraps `npm install -g @nodewave-io/redesign@latest`. Shells out
// instead of using a programmatic API so the upgrade actually runs in
// the user's npm prefix (Homebrew, fnm, asdf, etc., each have their
// own). stdio is inherited so users see npm's own progress output.
async function runUpdate(): Promise<number> {
  console.log(`Current version: ${VERSION}`)
  console.log('Running: npm install -g @nodewave-io/redesign@latest')
  return await new Promise<number>((resolve) => {
    const proc = spawn(
      'npm',
      ['install', '-g', '@nodewave-io/redesign@latest'],
      { stdio: 'inherit' },
    )
    proc.on('exit', (code) => {
      if (code === 0) {
        console.log(
          '\nUpdate complete. Run `redesign version` to confirm the new version.',
        )
      }
      resolve(code ?? 1)
    })
    proc.on('error', (err) => {
      console.error('npm not found on PATH:', err.message)
      resolve(1)
    })
  })
}

async function runStart(args: string[]): Promise<number> {
  const portFlag = args.findIndex((a) => a === '--port' || a === '-p')
  const requested = portFlag >= 0 ? Number(args[portFlag + 1]) : 3000
  if (!Number.isFinite(requested) || requested < 1 || requested > 65535) {
    console.error(`invalid port: ${args[portFlag + 1]}`)
    return 1
  }

  // Bootstrap the DB so first-run users don't see a blank grid.
  getDb()
  closeDb()

  // Idempotently register the MCP with Claude Code so the landing
  // page's "one command" promise actually holds. Skipped silently on
  // re-runs where the entry is already present. Non-fatal on error —
  // users can still run `redesign install-mcp` by hand.
  const mcpRes = await ensureMcpInstalled()
  if (mcpRes.status === 'added') {
    console.error(`[redesign] registered MCP with Claude Code (${mcpRes.path})`)
    console.error('[redesign] restart Claude Code once so it picks it up.')
  } else if (mcpRes.status === 'updated') {
    console.error(`[redesign] updated MCP registration in ${mcpRes.path}`)
  } else if (mcpRes.status === 'error') {
    console.error(
      `[redesign] couldn't auto-register MCP (${mcpRes.error}); run 'redesign install-mcp' manually`,
    )
  }

  // Find an actually-free port starting at `requested` and walking up
  // in 100s (3000 → 3100 → 3200 …) until something's open. Matches
  // the landing's "open localhost:3000" promise when possible.
  const port = await findFreePort(requested)
  if (port !== requested) {
    console.error(`[redesign] port ${requested} was in use, bound to ${port}`)
  }

  // Locate the Next build shipped alongside this module. When the
  // package is installed from npm, `dist/cli.js` lives next to `web/`.
  const here = dirname(fileURLToPath(import.meta.url))
  const webDir = locateWebDir(here)
  if (!webDir) {
    console.error(
      `[redesign] couldn't find the web/ directory. Expected it alongside the CLI.`,
    )
    return 1
  }

  // Persist the port so the MCP (run from Claude Code) knows where to
  // reach the editor. Written before spawning so the MCP can start
  // issuing screenshot calls as soon as Next is up.
  writeConfig({
    port,
    started_at: new Date().toISOString(),
    pid: process.pid,
  })

  const url = `http://localhost:${port}`
  console.log('')
  console.log(`  ▲ Redesign: editor running at ${url}`)
  console.log(`  ▲ Data dir: ${REDESIGN_HOME}`)
  console.log('')
  console.log('  Claude Code MCP: registered automatically on boot.')
  console.log('  If the tools don\'t appear after restarting Claude Code, run:')
  console.log('    npx @nodewave-io/redesign connect   (verifies the link and reports errors)')
  console.log('')
  console.log('  Press Ctrl-C to stop.')
  console.log('')

  // Pre-warm the Chrome download in the background so the user's first
  // Export click doesn't pay the 30-60s install penalty. Fire-and-
  // forget — failures are silent (the on-demand path in the export
  // route will log + retry). Idempotent: ensureChromium() short-
  // circuits when the binary is already cached under
  // ~/.redesign/chromium/.
  void (async () => {
    try {
      const { launchBrowser } = await import('./browser.js')
      // We only need the binary, not a running browser — but the
      // simplest way to trigger ensureChromium() without exposing
      // it is to launch + immediately close. The launch itself is
      // fast once the binary exists; first run is what we're warming.
      const browser = await launchBrowser({
        viewport: { width: 100, height: 100 },
      })
      await browser.close().catch(() => {})
    } catch {
      // Network unavailable / disk full / etc — the export route
      // will surface the real error if the user tries to export.
    }
  })()

  // Prefer the standalone server bundled into web/.next/standalone/ —
  // that's what ships in the npm tarball and has its own traced
  // node_modules, so it boots cleanly without `next` installed
  // anywhere. Fall back to `npx next start` in dev checkouts where
  // standalone hasn't been built yet.
  const standaloneServer = locateStandaloneServer(webDir)
  const next = standaloneServer
    ? spawn(process.execPath, [standaloneServer], {
        cwd: dirname(standaloneServer),
        stdio: 'inherit',
        env: {
          ...process.env,
          PORT: String(port),
          HOSTNAME: '127.0.0.1',
        },
      })
    : spawn('npx', ['next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
        cwd: webDir,
        stdio: 'inherit',
        env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1' },
      })

  // Forward Ctrl-C / terminate signals cleanly so the Next subprocess
  // doesn't linger after the CLI dies.
  const forward = (signal: NodeJS.Signals) => {
    next.kill(signal)
  }
  process.on('SIGINT', forward)
  process.on('SIGTERM', forward)

  return new Promise<number>((resolve) => {
    next.on('exit', (code) => resolve(code ?? 0))
    next.on('error', (err) => {
      console.error('[redesign] failed to start next:', err.message)
      resolve(1)
    })
  })
}

// Resolve where the shipped Next build lives. In the published package
// the layout is: <root>/dist/cli.js + <root>/web/. In a monorepo dev
// checkout we run from src/ via tsx, so <root>/src/cli.ts + <root>/web/
// — walk up until we find web/.next or web/package.json.
function locateWebDir(start: string): string | null {
  let dir = start
  for (let i = 0; i < 5; i++) {
    const candidate = join(dir, 'web')
    if (existsSync(join(candidate, 'package.json'))) return candidate
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

// Find the Next standalone server entry shipped in the published
// package (web/.next/standalone/server.js OR
// web/.next/standalone/web/server.js depending on the
// outputFileTracingRoot). Returns null when it isn't built — caller
// falls back to `next start`.
function locateStandaloneServer(webDir: string): string | null {
  const candidates = [
    join(webDir, '.next', 'standalone', 'web', 'server.js'),
    join(webDir, '.next', 'standalone', 'server.js'),
  ]
  return candidates.find((p) => existsSync(p)) ?? null
}

// Probe ports in 100-step increments so a blocked 3000 lands on 3100,
// which matches the dev-server fallback we've been using. `probe()`
// briefly binds the port — the OS frees it on close.
async function findFreePort(start: number): Promise<number> {
  for (let p = start; p < start + 1000; p += 100) {
    if (await probe(p)) return p
  }
  // Fall back to any free port if nothing on the 100-grid works.
  return probeAny()
}

function probe(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const srv = createServer()
    srv.once('error', () => resolve(false))
    srv.once('listening', () => {
      srv.close(() => resolve(true))
    })
    srv.listen(port, '127.0.0.1')
  })
}

function probeAny(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer()
    srv.once('error', reject)
    srv.once('listening', () => {
      const addr = srv.address()
      if (typeof addr === 'object' && addr && typeof addr.port === 'number') {
        const port = addr.port
        srv.close(() => resolve(port))
      } else {
        srv.close()
        reject(new Error('could not obtain assigned port'))
      }
    })
    srv.listen(0, '127.0.0.1')
  })
}

// Compare against the resolved real paths on both sides — the npm
// `bin` field installs a symlink at `node_modules/.bin/redesign`, so
// `process.argv[1]` is the symlink while `import.meta.url` resolves to
// the actual `dist/cli.js`. A naive `===` mismatches and the CLI
// silently exits without running `main()`.
const scriptPath = fileURLToPath(import.meta.url)
let invokedDirectly = false
try {
  invokedDirectly =
    realpathSync(process.argv[1] ?? '') === realpathSync(scriptPath)
} catch {
  // realpath can throw if argv[1] is missing or unreadable; fall back
  // to the literal comparison, which still works for non-symlink runs
  // (e.g. `node dist/cli.js ...` from a checkout).
  invokedDirectly =
    process.argv[1] === scriptPath || process.argv[1] === join(scriptPath)
}
if (invokedDirectly) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(err)
      process.exit(1)
    },
  )
}
