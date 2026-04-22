// GET    /api/posts/:id     — full post
// PATCH  /api/posts/:id     — update (optional expected_updated_at guard)
// DELETE /api/posts/:id     — delete
//
// The editor's auto-save translates its Supabase chain into a PATCH
// against this route with a JSON body like:
//   { patch: {...}, expected_updated_at: "2026-04-22T..." }
// A stale expected_updated_at returns 409 so the client knows to
// re-fetch and retry.

import { NextRequest, NextResponse } from 'next/server'
import {
  StaleUpdateError,
  NotFoundError,
  deletePost,
  getPost,
  updatePost,
  type PostPatch,
} from '@/lib/db/repo'

type PatchBody = {
  patch: PostPatch
  expected_updated_at?: string
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params
  try {
    return NextResponse.json(getPost(id))
  } catch (err) {
    return handle(err)
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params
  const body = (await req.json()) as PatchBody
  try {
    const next = updatePost(id, body.patch ?? {}, body.expected_updated_at)
    return NextResponse.json({ id: next.id, updated_at: next.updated_at })
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
    deletePost(id)
    return NextResponse.json({ deleted: id })
  } catch (err) {
    return handle(err)
  }
}

function handle(err: unknown): NextResponse {
  if (err instanceof StaleUpdateError) {
    return NextResponse.json({ error: err.message }, { status: 409 })
  }
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 })
  }
  const msg = err instanceof Error ? err.message : String(err)
  return NextResponse.json({ error: msg }, { status: 500 })
}
