// POST /api/storage/upload  — blob-only upload
//
// Body: multipart/form-data
//   file: the raw bytes (required)
//   bucket: "assets" | "exports"  (default "assets")
//
// Saves the bytes under ~/.redesign/<bucket>/<uuid>.<ext> and returns
// { storage_path, file_url }. The caller then does a separate
// POST /api/assets with the file_url to create the DB row (mirrors
// the Supabase storage.upload + from.insert split so the editor's
// verbatim flow keeps working).

import { NextRequest, NextResponse } from 'next/server'
import { saveAssetBytes, saveAssetBytesAtPath, saveExportBytes } from '@/lib/db/storage'

export const runtime = 'nodejs'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }
  const bucket = String(form.get('bucket') ?? 'assets')
  if (bucket !== 'assets' && bucket !== 'exports') {
    return NextResponse.json({ error: `unknown bucket: ${bucket}` }, { status: 400 })
  }
  const bytes = Buffer.from(await file.arrayBuffer())
  const mime = (file as File).type || 'application/octet-stream'
  const originalName = (file as File).name
  // Optional target path — if the caller pre-mints a stable path (the
  // editor's asset-upload flow does this so the db row and the blob
  // share the same name), we save at that exact path instead of an
  // auto-generated uuid. `saveAssetBytesAtPath` sanitizes it.
  const targetPath = stringOrNull(form.get('path'))
  const saved =
    bucket === 'exports'
      ? await saveExportBytes(bytes, originalName || 'export.zip')
      : targetPath
        ? await saveAssetBytesAtPath(bytes, mime, targetPath)
        : await saveAssetBytes(bytes, mime, originalName)
  return NextResponse.json(saved)
}

function stringOrNull(v: FormDataEntryValue | null): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s.length ? s : null
}
