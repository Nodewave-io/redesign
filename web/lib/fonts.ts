// User-supplied fonts under ~/.redesign/fonts/. Drop a .ttf/.otf/.woff/
// .woff2 file in there; this module discovers it, hands the editor a
// list, and serves the bytes via /api/fonts.
//
// The font-family name visible to text layers is the file's basename
// without extension. Spaces and special chars in the name are
// preserved verbatim because CSS allows quoted family names.

import {
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { extname, basename, join, normalize, sep } from 'node:path'
import { FONTS_DIR } from './db/paths'

export type UserFont = {
  family: string
  file: string
  format: 'truetype' | 'opentype' | 'woff' | 'woff2'
  mime: string
  size: number
}

const ALLOWED: Record<string, { format: UserFont['format']; mime: string }> = {
  '.ttf':   { format: 'truetype', mime: 'font/ttf' },
  '.otf':   { format: 'opentype', mime: 'font/otf' },
  '.woff':  { format: 'woff',     mime: 'font/woff' },
  '.woff2': { format: 'woff2',    mime: 'font/woff2' },
}

export function listUserFonts(): UserFont[] {
  let entries: string[]
  try {
    entries = readdirSync(FONTS_DIR)
  } catch {
    // Folder hasn't been created yet (pre-bootstrap) or the user
    // deleted it. Treat as empty rather than blowing up.
    return []
  }
  const fonts: UserFont[] = []
  for (const name of entries) {
    if (name.startsWith('.')) continue
    const ext = extname(name).toLowerCase()
    const info = ALLOWED[ext]
    if (!info) continue
    const full = join(FONTS_DIR, name)
    let size: number
    try {
      const stat = statSync(full)
      if (!stat.isFile()) continue
      size = stat.size
    } catch {
      continue
    }
    fonts.push({
      family: basename(name, ext),
      file: name,
      format: info.format,
      mime: info.mime,
      size,
    })
  }
  return fonts.sort((a, b) => a.family.localeCompare(b.family))
}

// Resolve a request for /api/fonts/<file> to an absolute path on disk,
// rejecting anything that escapes FONTS_DIR or has a disallowed
// extension. Returns null when the file isn't a real, served font.
export function resolveUserFont(name: string): {
  path: string
  mime: string
} | null {
  // Strip any directory components a client might smuggle in. We
  // accept only a bare filename.
  const safe = basename(name)
  if (safe !== name) return null
  const ext = extname(safe).toLowerCase()
  const info = ALLOWED[ext]
  if (!info) return null
  const full = normalize(join(FONTS_DIR, safe))
  // Use realpath to dereference any symlinks before the prefix check,
  // and use the platform path separator so this stays correct on
  // Windows. A symlink pointing outside FONTS_DIR would resolve to a
  // path that doesn't start with realFontsDir + sep and gets rejected.
  let realFull: string
  let realFontsDir: string
  try {
    realFull = realpathSync(full)
    realFontsDir = realpathSync(FONTS_DIR)
  } catch {
    return null
  }
  if (
    realFull !== realFontsDir &&
    !realFull.startsWith(realFontsDir + sep)
  ) {
    return null
  }
  try {
    const stat = statSync(realFull)
    if (!stat.isFile()) return null
  } catch {
    return null
  }
  return { path: realFull, mime: info.mime }
}

export function readUserFontBytes(name: string): {
  bytes: Buffer
  mime: string
} | null {
  const resolved = resolveUserFont(name)
  if (!resolved) return null
  return { bytes: readFileSync(resolved.path), mime: resolved.mime }
}

// 5 MB ceiling on uploaded font files. Brand fonts (woff2) are
// typically <300 KB. Multi-weight TTF families can be larger; still
// well under 5 MB. Chosen to fit a comfortable headroom without
// letting an attacker fill the disk via the unauthenticated localhost
// endpoint (paranoid-mode: this is local-only, but a CSRF from a
// malicious page in another tab could still POST here).
export const MAX_FONT_BYTES = 5 * 1024 * 1024

export class FontUploadError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'FontUploadError'
  }
}

// Save an uploaded font into ~/.redesign/fonts/. Sanitizes filename to
// alphanumerics + dash + underscore + dot, validates extension, caps
// size, and refuses duplicates by family (basename without extension)
// so the @font-face registry never has two competing files for the
// same family name.
export function saveUserFont(
  filename: string,
  bytes: Uint8Array | Buffer,
): UserFont {
  const ext = extname(filename).toLowerCase()
  const info = ALLOWED[ext]
  if (!info) {
    throw new FontUploadError(
      `Unsupported font extension: ${ext}. Use .ttf, .otf, .woff, or .woff2.`,
      400,
    )
  }
  if (bytes.byteLength === 0) {
    throw new FontUploadError('Font file is empty.', 400)
  }
  if (bytes.byteLength > MAX_FONT_BYTES) {
    throw new FontUploadError(
      `Font file exceeds ${Math.round(MAX_FONT_BYTES / (1024 * 1024))} MB limit.`,
      413,
    )
  }
  const stem = basename(filename, ext)
  const safeStem = stem.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80)
  if (!safeStem) {
    throw new FontUploadError('Font filename has no usable characters.', 400)
  }
  const safeName = `${safeStem}${ext}`
  // Refuse duplicates by family (any file in FONTS_DIR sharing the
  // same basename, regardless of extension), to keep the @font-face
  // registry unambiguous. User has to delete the old one first.
  mkdirSync(FONTS_DIR, { recursive: true })
  for (const existing of readdirSync(FONTS_DIR)) {
    const eExt = extname(existing).toLowerCase()
    if (!ALLOWED[eExt]) continue
    if (basename(existing, eExt) === safeStem) {
      throw new FontUploadError(
        `A font named "${safeStem}" already exists. Delete it first or upload under a different name.`,
        409,
      )
    }
  }
  writeFileSync(join(FONTS_DIR, safeName), bytes)
  return {
    family: safeStem,
    file: safeName,
    format: info.format,
    mime: info.mime,
    size: bytes.byteLength,
  }
}

export function deleteUserFont(name: string): boolean {
  const resolved = resolveUserFont(name)
  if (!resolved) return false
  try {
    unlinkSync(resolved.path)
    return true
  } catch {
    return false
  }
}
