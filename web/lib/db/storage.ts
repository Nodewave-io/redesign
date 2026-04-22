// File storage helpers — the fs counterpart to repo.ts.
//
// Image assets that used to live in the Supabase `media-assets` storage
// bucket now land under ~/.redesign/assets/<uuid>.<ext>. Exports that
// used to go to `media-exports` land under ~/.redesign/exports/. The
// Next app serves both via static file routes so the editor <img>
// tags don't need to care where the bytes live.

import { extname, dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile, unlink } from 'node:fs/promises'
import { ASSETS_DIR, EXPORTS_DIR, ensureDirs } from './paths'

export type StoredFile = {
  storage_path: string  // relative, e.g. "assets/7f3e-….png"
  file_url: string      // URL the editor can fetch, e.g. "/api/storage/assets/7f3e-….png"
  mime_type: string
  bytes: number
}

export async function saveAssetBytes(
  data: Buffer | Uint8Array,
  mime: string,
  originalName?: string,
): Promise<StoredFile> {
  ensureDirs()
  const ext = (extname(originalName ?? '') || extFromMime(mime)).toLowerCase()
  const filename = `${randomUUID()}${ext}`
  const absPath = join(ASSETS_DIR, filename)
  const buffer = data instanceof Buffer ? data : Buffer.from(data)
  await writeFile(absPath, buffer)
  return {
    storage_path: `assets/${filename}`,
    file_url: `/api/storage/assets/${filename}`,
    mime_type: mime,
    bytes: buffer.byteLength,
  }
}

// Variant of saveAssetBytes for callers who already own the storage
// path (the editor's image-upload flow mints a path like
// `upload/<uuid>-<sanitized-filename>.png` before the PUT so the db
// row and the blob share the same name). We accept a nested path,
// sanitize each segment, and save under ~/.redesign/assets/<path>.
export async function saveAssetBytesAtPath(
  data: Buffer | Uint8Array,
  mime: string,
  targetPath: string,
): Promise<StoredFile> {
  ensureDirs()
  // Reject obvious path-traversal attempts before we sanitize.
  if (targetPath.startsWith('/') || targetPath.includes('..')) {
    throw new Error(`illegal storage path: ${targetPath}`)
  }
  const cleanPath = targetPath
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/[^a-zA-Z0-9._-]/g, '_'))
    .join('/')
  if (!cleanPath) throw new Error('empty storage path after sanitization')
  const absPath = join(ASSETS_DIR, cleanPath)
  await mkdir(dirname(absPath), { recursive: true })
  const buffer = data instanceof Buffer ? data : Buffer.from(data)
  await writeFile(absPath, buffer)
  return {
    storage_path: `assets/${cleanPath}`,
    file_url: `/api/storage/assets/${cleanPath}`,
    mime_type: mime,
    bytes: buffer.byteLength,
  }
}

export async function saveExportBytes(
  data: Buffer | Uint8Array,
  filename: string,
): Promise<StoredFile> {
  ensureDirs()
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const absPath = join(EXPORTS_DIR, safe)
  const buffer = data instanceof Buffer ? data : Buffer.from(data)
  await writeFile(absPath, buffer)
  return {
    storage_path: `exports/${safe}`,
    file_url: `/api/storage/exports/${safe}`,
    mime_type: 'application/zip',
    bytes: buffer.byteLength,
  }
}

// Best-effort removal — swallows missing-file errors so callers can
// delete an asset row even when the underlying blob already vanished.
export async function removeStoredFile(storagePath: string | null): Promise<void> {
  if (!storagePath) return
  const absPath = resolveStoragePath(storagePath)
  if (!absPath) return
  try {
    await unlink(absPath)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code !== 'ENOENT') throw err
  }
}

// Turn a storage_path (e.g. "assets/xyz.png" or "assets/upload/sub/xyz.png")
// into an absolute path under ~/.redesign/, rejecting traversal attempts.
// Bare paths without a bucket prefix (e.g. "xyz.png") are treated as
// assets — that's what the Supabase-shim editor flow stores.
export function resolveStoragePath(storagePath: string): string | null {
  if (storagePath.startsWith('/')) return null
  if (storagePath.includes('..')) return null
  const [head, ...rest] = storagePath.split('/')
  if (head === 'assets') {
    const name = rest.join('/')
    return name ? join(ASSETS_DIR, name) : null
  }
  if (head === 'exports') {
    const name = rest.join('/')
    return name ? join(EXPORTS_DIR, name) : null
  }
  // No bucket prefix — treat the whole thing as a path inside assets/.
  return join(ASSETS_DIR, storagePath)
}

function extFromMime(mime: string): string {
  switch (mime) {
    case 'image/png':
      return '.png'
    case 'image/jpeg':
      return '.jpg'
    case 'image/webp':
      return '.webp'
    case 'image/gif':
      return '.gif'
    case 'image/svg+xml':
      return '.svg'
    case 'application/zip':
      return '.zip'
    default:
      return ''
  }
}
