// GET    /api/collections/:id   fetch one
// PATCH  /api/collections/:id   rename
// DELETE /api/collections/:id   delete (rejected if any posts still reference it)

import { NextRequest, NextResponse } from 'next/server'
import {
  NotFoundError,
  deleteCollection,
  getCollection,
  updateCollection,
} from '@/lib/db/repo'

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params
  try {
    return NextResponse.json(getCollection(id))
  } catch (err) {
    return handle(err)
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await ctx.params
  const body = (await req.json()) as { name?: unknown }
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }
  if (name.length > 120) {
    return NextResponse.json(
      { error: 'name must be 120 characters or fewer' },
      { status: 400 },
    )
  }
  try {
    return NextResponse.json(updateCollection(id, name))
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
    deleteCollection(id)
    return NextResponse.json({ deleted: id })
  } catch (err) {
    return handle(err)
  }
}

function handle(err: unknown): NextResponse {
  if (err instanceof NotFoundError) {
    return NextResponse.json({ error: err.message }, { status: 404 })
  }
  const msg = err instanceof Error ? err.message : String(err)
  // Posts-still-attached refusal lives in the repo and surfaces here as
  // a generic Error. Send it as 409 (conflict) so the client UI can
  // distinguish it from a server-side blowup.
  if (/still has \d+ post/.test(msg)) {
    return NextResponse.json({ error: msg }, { status: 409 })
  }
  return NextResponse.json({ error: msg }, { status: 500 })
}
