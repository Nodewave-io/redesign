// Runtime config exchanged between the CLI and the MCP.
//
// When `redesign start` boots the Next server, it writes the active
// port to ~/.redesign/config.json. The MCP reads the same file so its
// screenshot tools know where to point puppeteer. Keeping this in a
// tiny JSON file (not env vars) means the MCP can be started from
// anywhere — the user's Claude Code session doesn't need to inherit
// the CLI's environment.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { REDESIGN_HOME, ensureDirs } from './db/paths.js'

export const CONFIG_PATH = join(REDESIGN_HOME, 'config.json')

export type RedesignConfig = {
  /** Port the local editor server is bound to. Default 3000. */
  port: number
  /** ISO timestamp — when the CLI last wrote this file. Useful for
   *  debugging stale config after an unclean shutdown. */
  started_at: string
  /** PID of the CLI process owning the server, if known. */
  pid?: number
}

const DEFAULT: RedesignConfig = {
  port: 3000,
  started_at: new Date(0).toISOString(),
}

export function readConfig(): RedesignConfig {
  if (!existsSync(CONFIG_PATH)) return DEFAULT
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<RedesignConfig>
    return {
      port: typeof parsed.port === 'number' ? parsed.port : DEFAULT.port,
      started_at: parsed.started_at ?? DEFAULT.started_at,
      pid: typeof parsed.pid === 'number' ? parsed.pid : undefined,
    }
  } catch {
    return DEFAULT
  }
}

export function writeConfig(patch: Partial<RedesignConfig>): RedesignConfig {
  ensureDirs()
  const current = readConfig()
  const next: RedesignConfig = { ...current, ...patch }
  writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2) + '\n', 'utf-8')
  return next
}

// The MCP tells users how to reach the editor. Prefer IPv4 loopback
// since some Node/Chromium combos resolve `localhost` to IPv6 first
// and get a connection refused when the server only listens on IPv4.
export function serverUrl(port: number = readConfig().port): string {
  return `http://127.0.0.1:${port}`
}
