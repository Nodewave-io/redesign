// GET    /api/assets/:id  — full asset
// PATCH  /api/assets/:id  — metadata patch (name/description/usage_notes/categories/tags)
// DELETE /api/assets/:id  — remove row + file (for image-kind assets)

import { NextRequest, NextResponse } from 'next/server'
import {
  NotFoundError,
  deleteAsset,
  getAsset,
  updateAsset,
  type AssetPatch,
} from '@/lib/db/repo'
import { removeStoredFile } from '@/lib/db/storage'

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params
  try {
    return NextResponse.json(getAsset(id))
  } catch (err) {
    return handle(err)
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params
  const patch = (await req.json()) as AssetPatch
  try {
    return NextResponse.json(updateAsset(id, patch))
  } catch (err) {
    return handle(err)
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params
  try {
    const asset = deleteAsset(id)
    if (asset.storage_path) {
      await removeStoredFile(asset.storage_path).catch(() => {})
    }
    return NextResponse.json({ deleted: id, name: asset.name })
  } catch (err) {
    return handle(err)
  }
}

function handle(err: unknown): NextResponse {
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 })
  }
  const msg = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: msg }, { status: 500 })
}
