// Font discovery for the MCP side. Mirror of web/lib/fonts.ts so the
// scanning logic stays in one place across both runtimes.

import { readdirSync, statSync } from 'node:fs'
import { extname, basename, join } from 'node:path'
import { FONTS_DIR } from './paths.js'

export type UserFont = {
  family: string
  file: string
  format: 'truetype' | 'opentype' | 'woff' | 'woff2'
  size: number
}

const ALLOWED: Record<string, UserFont['format']> = {
  '.ttf':   'truetype',
  '.otf':   'opentype',
  '.woff':  'woff',
  '.woff2': 'woff2',
}

export function listUserFonts(): UserFont[] {
  let entries: string[]
  try {
    entries = readdirSync(FONTS_DIR)
  } catch {
    return []
  }
  const fonts: UserFont[] = []
  for (const name of entries) {
    if (name.startsWith('.')) continue
    const ext = extname(name).toLowerCase()
    const format = ALLOWED[ext]
    if (!format) continue
    const full = join(FONTS_DIR, name)
    let size: number
    try {
      const stat = statSync(full)
      if (!stat.isFile()) continue
      size = stat.size
    } catch {
      continue
    }
    fonts.push({ family: basename(name, ext), file: name, format, size })
  }
  return fonts.sort((a, b) => a.family.localeCompare(b.family))
}

// The built-ins shipped with the editor. Always available, no user
// install required. Returned alongside user fonts by the MCP list
// tool so Claude sees the full picture in one call.
export const BUILTIN_FONTS: { family: string; description: string }[] = [
  { family: 'display', description: 'Manrope. Default headline / body face.' },
  { family: 'geist', description: 'Geist Sans. Clean modern body face used on nodewave.io.' },
  { family: 'sans', description: 'Inter / system sans fallback.' },
  { family: 'mono', description: 'Space Mono. Use for code or accent labels.' },
  { family: 'system', description: 'OS system font (SF Pro on macOS). Editor-only; falls back in exports.' },
]
