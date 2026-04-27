// GET  /api/fonts   list every font file in ~/.redesign/fonts/
// POST /api/fonts   upload a font file (multipart form, field "file")
//
// Each list entry includes the font-family name (the basename without
// extension), the served file path, the @font-face format keyword,
// and the byte size. Used by the editor's font picker AND by the
// shared <UserFonts /> component which injects @font-face rules.

import { NextRequest, NextResponse } from 'next/server'
import {
  FontUploadError,
  listUserFonts,
  saveUserFont,
} from '@/lib/fonts'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(listUserFonts())
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json(
      { error: 'Expected multipart form-data with a "file" field.' },
      { status: 400 },
    )
  }
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Missing "file" field in upload.' },
      { status: 400 },
    )
  }
  try {
    const bytes = Buffer.from(await file.arrayBuffer())
    const saved = saveUserFont(file.name, bytes)
    return NextResponse.json(saved, { status: 201 })
  } catch (err) {
    if (err instanceof FontUploadError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
