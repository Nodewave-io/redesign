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

const VERSION = '0.1.0'

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
    case 'install-mcp':
      return runInstallMcp()
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
      '  mcp-config        Print the .mcp.json snippet to paste into ~/.claude/mcp.json',
      '  install-mcp       Auto-merge the snippet into ~/.claude/mcp.json (recommended)',
      '  init              Create ~/.redesign and bootstrap the SQLite schema',
      '  seed [dir]        Import a folder of TSX icons into the asset library',
      '                    (defaults to ./seed/icons; pass --replace to wipe first)',
      '  doctor            Check your environment is good to go',
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
      redesign: {
        command: 'npx',
        args: ['-y', '@nodewave-io/redesign', 'mcp'],
      },
    },
  }
  console.log(JSON.stringify(snippet, null, 2))
}

// Merge the redesign MCP entry into the user's Claude Code config at
// ~/.claude/mcp.json. Idempotent (re-running is safe). Preserves any
// other MCPs the user has already registered. Removes the most
// failure-prone onboarding step: hand-editing JSON.
async function runInstallMcp(): Promise<number> {
  const { readFile, writeFile, mkdir } = await import('node:fs/promises')
  const path = await import('node:path')
  const cfgDir = path.join(homedir(), '.claude')
  const cfgPath = path.join(cfgDir, 'mcp.json')
  const entry = {
    command: 'npx',
    args: ['-y', '@nodewave-io/redesign', 'mcp'],
  }

  const { rename } = await import('node:fs/promises')
  await mkdir(cfgDir, { recursive: true })
  let existing: { mcpServers?: Record<string, unknown> } = {}
  try {
    const raw = await readFile(cfgPath, 'utf-8')
    existing = JSON.parse(raw) as typeof existing
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') {
      console.error(
        `[redesign] couldn't read existing ${cfgPath}: ${(err as Error).message}`,
      )
      console.error(
        `[redesign] file looks corrupted — paste the snippet manually with: redesign mcp-config`,
      )
      return 1
    }
  }
  const servers = (existing.mcpServers ?? {}) as Record<string, unknown>
  const wasPresent = 'redesign' in servers
  servers.redesign = entry
  const next = { ...existing, mcpServers: servers }
  // Write atomically via a sibling tmpfile + rename so a concurrent
  // Claude Code reading mcp.json never sees a half-written file. Mode
  // 0600 because the file may eventually hold MCP entries with API
  // keys/tokens in args/env — better to lock down up front than to
  // leave it world-readable like the default umask would.
  const tmp = `${cfgPath}.tmp.${process.pid}`
  await writeFile(tmp, JSON.stringify(next, null, 2) + '\n', { encoding: 'utf-8', mode: 0o600 })
  await rename(tmp, cfgPath)

  console.log('')
  console.log(
    wasPresent
      ? `  ✓ Updated 'redesign' entry in ${cfgPath}`
      : `  ✓ Added 'redesign' entry to ${cfgPath}`,
  )
  console.log('')
  console.log('  Restart Claude Code so it picks up the new MCP.')
  console.log('  Then in any session, ask Claude to "make a 5-slide carousel"')
  console.log('  and watch it work.')
  console.log('')
  return 0
}

async function runMcp(): Promise<number> {
  // Defer to the stdio server entry. It registers all tools, connects
  // the transport, and holds the process open until Claude Code
  // disconnects.
  const modPath = new URL('./mcp/index.js', import.meta.url)
  await import(modPath.href)
  // Imported module never resolves (stdio loop) — but if it does,
  // exit cleanly.
  return 0
}

async function runDoctor(): Promise<number> {
  let ok = true
  const tick = (label: string, good: boolean, detail = ''): void => {
    console.log(`  ${good ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`)
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
  console.log(ok ? 'All checks passed.' : 'Some checks failed — see above.')
  return ok ? 0 : 1
}

async function runReset(skipConfirm: boolean): Promise<number> {
  if (!existsSync(REDESIGN_HOME)) {
    console.log(`Nothing to delete — ${REDESIGN_HOME} does not exist.`)
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
    console.error(`[redesign] seed dir not found: ${root ?? '(auto-detect failed)'}`)
    console.error('Pass a path, e.g. `redesign seed ~/Downloads/my-icons`.')
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
          console.error(`[redesign] ${pct}% — ${i}/${total} (${name})`)
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

  // Find an actually-free port starting at `requested` and walking up
  // in 100s (3000 → 3100 → 3200 …) until something's open. Matches
  // the landing's "open localhost:3000" promise when possible.
  const port = await findFreePort(requested)
  if (port !== requested) {
    console.error(`[redesign] port ${requested} was in use — bound to ${port}`)
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
  console.log(`  ▲ Redesign — editor running at ${url}`)
  console.log(`  ▲ Data dir: ${REDESIGN_HOME}`)
  console.log('')
  console.log('  Connect Claude Code:')
  console.log('    npx @nodewave-io/redesign install-mcp   (auto-installs the MCP entry)')
  console.log('    …then restart Claude Code.')
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
