// GET    /api/fonts/:name   serve a single font file from ~/.redesign/fonts/
// DELETE /api/fonts/:name   remove a font file
//
// `name` is the bare filename (e.g. NodewaveDisplay.woff2). The
// resolver in lib/fonts.ts rejects anything that doesn't end in an
// allowed extension or that tries to escape FONTS_DIR.

import { NextRequest, NextResponse } from 'next/server'
import { deleteUserFont, readUserFontBytes } from '@/lib/fonts'

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ name: string }> },
): Promise<NextResponse> {
  const { name } = await ctx.params
  const result = readUserFontBytes(decodeURIComponent(name))
  if (!result) {
    return new NextResponse('font not found', { status: 404 })
  }
  return new NextResponse(new Uint8Array(result.bytes), {
    status: 200,
    headers: {
      'Content-Type': result.mime,
      // Short browser cache, no immutable. A user can delete and
      // re-upload a font under the same filename; immutable would
      // pin the stale bytes in the browser cache for a year.
      'Cache-Control': 'public, max-age=300',
    },
  })
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ name: string }> },
): Promise<NextResponse> {
  const { name } = await ctx.params
  const ok = deleteUserFont(decodeURIComponent(name))
  if (!ok) {
    return NextResponse.json({ error: 'font not found' }, { status: 404 })
  }
  return NextResponse.json({ deleted: name })
}
