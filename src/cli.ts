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

import { existsSync, rmSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { REDESIGN_HOME, DB_PATH, ensureDirs } from './db/paths.js'
import { closeDb, getDb } from './db/client.js'

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

async function runInit(): Promise<number> {
  getDb() // bootstrap schema
  closeDb()
  console.log(`Initialized ${DB_PATH}`)
  return 0
}

async function runStart(args: string[]): Promise<number> {
  const portFlag = args.findIndex((a) => a === '--port' || a === '-p')
  const port = portFlag >= 0 ? Number(args[portFlag + 1]) : 3000
  // Bootstrap so first-run users don't see a blank /admin flash.
  getDb()
  closeDb()
  console.error(
    [
      '`redesign start` is a stub until the editor lands in redesign/web/.',
      '',
      `Once the port is done, this will:`,
      `  1. Spawn \`next start\` on http://127.0.0.1:${port}`,
      '  2. Print the MCP config snippet for Claude Code',
      '  3. Open your browser to the editor',
      '',
      'For now, the MCP server IS working. To wire it up:',
      '  npx @nodewave/redesign mcp-config  # copy the snippet',
      '  # paste into ~/.claude/mcp.json',
    ].join('\n'),
  )
  return 0
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
