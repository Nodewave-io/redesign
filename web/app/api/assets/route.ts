// GET  /api/assets  — list, optional `?kind=image|component` + `?q=search`
// POST /api/assets  — create a metadata row (images upload via /api/assets/upload)

import { NextRequest, NextResponse } from 'next/server'
import { createAsset, listAssets, type NewAssetInput } from '@/lib/db/repo'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url)
  const kindParam = url.searchParams.get('kind')
  const kind =
    kindParam === 'image' || kindParam === 'component' ? kindParam : undefined
  let rows = listAssets(kind)
  const q = url.searchParams.get('q')?.toLowerCase()
  if (q) {
    rows = rows.filter((a) => {
      const hay = [a.name, a.description ?? '', a.usage_notes ?? '']
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as NewAssetInput
  const asset = createAsset(body)
  return NextResponse.json(asset)
}
