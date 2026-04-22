// File storage helpers — the fs counterpart to repo.ts.
//
// Image assets that used to live in the Supabase `media-assets` storage
// bucket now land under ~/.redesign/assets/<uuid>.<ext>. Exports that
// used to go to `media-exports` land under ~/.redesign/exports/. The
// Next app serves both via static file routes so the editor <img>
// tags don't need to care where the bytes live.

import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeFile, unlink } from 'node:fs/promises'
import { ASSETS_DIR, EXPORTS_DIR, ensureDirs } from './paths.js'

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

// Turn a storage_path (e.g. "assets/xyz.png") into an absolute path
// under ~/.redesign/, rejecting anything that tries to escape the
// directory via .. or a leading slash. Returns null for obviously
// malformed input — callers should treat that as a not-found.
export function resolveStoragePath(storagePath: string): string | null {
  if (storagePath.startsWith('/')) return null
  if (storagePath.includes('..')) return null
  const [bucket, ...rest] = storagePath.split('/')
  const name = rest.join('/')
  if (!name) return null
  if (bucket === 'assets') return join(ASSETS_DIR, name)
  if (bucket === 'exports') return join(EXPORTS_DIR, name)
  return null
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
