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
  // Accept both shapes: {patch: {...}} (the editor sends this via the
  // Supabase shim, mirroring the posts route's PatchBody contract) AND
  // a bare patch object (what MCP tools and direct API callers send).
  // Without the unwrap, fields land under `patch.patch.X` so every
  // column check returns undefined and the row updates nothing —
  // PATCH returns 200 with no actual change. That's the silent-save
  // failure that hits the asset Edit modal.
  const body = (await req.json()) as Record<string, unknown>
  const isWrapped = body && typeof body.patch === 'object' && body.patch !== null
  const patch = (isWrapped ? body.patch : body) as AssetPatch
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
