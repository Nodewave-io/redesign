// GET /api/storage/:bucket/*name  — serve a blob from ~/.redesign/<bucket>/
//
// Replaces the public-CDN URLs Supabase Storage was handing out. Only
// two buckets are allow-listed (assets, exports) and the joined path is
// checked against path traversal in resolveStoragePath. Catch-all so
// nested keys (e.g. `assets/upload/<uuid>-foo.png` from the editor's
// upload flow) resolve correctly.

import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { NextRequest, NextResponse } from 'next/server'
import { resolveStoragePath } from '@/lib/db/storage'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ bucket: string; name: string[] }> },
): Promise<NextResponse> {
  const { bucket, name } = await ctx.params
  const joined = Array.isArray(name) ? name.join('/') : String(name ?? '')
  const absPath = resolveStoragePath(`${bucket}/${joined}`)
  if (!absPath) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  try {
    const info = await stat(absPath)
    if (!info.isFile()) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    // Node's ReadStream implements the Readable interface; Next expects
    // a WHATWG ReadableStream, which Readable.toWeb adapts for us.
    const nodeStream = createReadStream(absPath)
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream
    return new NextResponse(webStream, {
      headers: {
        'Content-Type': mimeFromName(joined),
        'Content-Length': String(info.size),
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}

function mimeFromName(name: string): string {
  const ext = name.toLowerCase().split('.').pop() ?? ''
  switch (ext) {
    case 'png':  return 'image/png'
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'webp': return 'image/webp'
    case 'gif':  return 'image/gif'
    case 'svg':  return 'image/svg+xml'
    case 'avif': return 'image/avif'
    case 'zip':  return 'application/zip'
    default:     return 'application/octet-stream'
  }
}
