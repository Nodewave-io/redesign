// Canonical filesystem layout for a Redesign install.
//
// Everything lives under ~/.redesign/ (override via REDESIGN_HOME env
// var for testing). Nothing else is written outside this dir — that
// means a clean uninstall is `rm -rf ~/.redesign && npm uninstall -g
// @nodewave-io/redesign`.
//
//   ~/.redesign/
//     db.sqlite            single-file DB (WAL sidecars live next to it)
//     assets/<uuid>.<ext>  image + component thumbnails uploaded by the user
//     exports/<id>.zip     generated export bundles, cleaned on demand
//     logs/mcp.log         stderr mirror of the MCP server for debugging
//     fonts/<name>.<ext>   user-supplied .ttf/.otf/.woff/.woff2 font files;
//                          the editor scans this folder on boot and
//                          registers each as a CSS @font-face. The
//                          basename (without extension) becomes the
//                          font-family name a text layer can reference.

import { homedir } from 'node:os'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

export const REDESIGN_HOME =
  process.env.REDESIGN_HOME ?? join(homedir(), '.redesign')

export const DB_PATH      = join(REDESIGN_HOME, 'db.sqlite')
export const ASSETS_DIR   = join(REDESIGN_HOME, 'assets')
export const EXPORTS_DIR  = join(REDESIGN_HOME, 'exports')
export const LOGS_DIR     = join(REDESIGN_HOME, 'logs')
export const FONTS_DIR    = join(REDESIGN_HOME, 'fonts')

// Idempotent: safe to call on every boot. `recursive: true` makes
// mkdir a no-op when the dir already exists.
export function ensureDirs(): void {
  for (const dir of [REDESIGN_HOME, ASSETS_DIR, EXPORTS_DIR, LOGS_DIR, FONTS_DIR]) {
    mkdirSync(dir, { recursive: true })
  }
}
