#!/usr/bin/env node
// Redesign CLI. Thin wrapper over:
//   • the Next.js editor bundled in web/ (once ported)
//   • the MCP server at src/mcp/index.ts
//   • the SQLite DB at ~/.redesign/db.sqlite
//
// Commands:
//   redesign start [--port 3000]   Start the local editor + print mcp-config
//   redesign mcp                    Run the stdio MCP server (Claude Code calls this)
//   redesign mcp-config             Print the .mcp.json snippet to stdout
//   redesign doctor                 Environment check (node version, sqlite, perms)
//   redesign reset [--yes]          Wipe ~/.redesign (asks unless --yes)
//   redesign --help / --version
//
// `start` is deliberately a stub — it will spawn next once web/ lands.
// Everything else is functional today.

import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { existsSync, rmSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { REDESIGN_HOME, DB_PATH, ensureDirs } from './db/paths.js'
import { closeDb, getDb } from './db/client.js'
import { writeConfig } from './config.js'
import { seedIcons } from './seed.js'

const VERSION = '0.1.0-pre'

async function main(argv: string[]): Promise<number> {
  const [cmd, ...rest] = argv
  switch (cmd) {
    case undefined:
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
      '  redesign <command> [options]',
      '',
      'COMMANDS',
      '  start [--port N]  Start the local editor (spawns Next on :N, default 3000)',
      '  mcp               Run the stdio MCP server (invoked by Claude Code)',
      '  mcp-config        Print the .mcp.json snippet to paste into ~/.claude/mcp.json',
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
        args: ['-y', '@nodewave/redesign', 'mcp'],
      },
    },
  }
  console.log(JSON.stringify(snippet, null, 2))
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
  console.log('  MCP config (paste into ~/.claude/mcp.json):')
  console.log('    { "mcpServers": { "redesign": { "command": "npx",')
  console.log('                                    "args": ["-y", "@nodewave/redesign", "mcp"] } } }')
  console.log('')
  console.log('  Press Ctrl-C to stop.')
  console.log('')

  // Spawn `next start` against the bundled build. Inherit stdio so the
  // user sees request logs + hot errors in real time. `PORT` is the
  // env var `next start` honors when no `-p` flag is passed.
  const next = spawn('npx', ['next', 'start', '-p', String(port)], {
    cwd: webDir,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
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

const scriptPath = fileURLToPath(import.meta.url)
const invokedDirectly =
  process.argv[1] === scriptPath || process.argv[1] === join(scriptPath)
if (invokedDirectly) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(err)
      process.exit(1)
    },
  )
}
