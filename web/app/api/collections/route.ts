// GET  /api/collections      list every collection (oldest first)
// POST /api/collections      create a new one with a name

import { NextRequest, NextResponse } from 'next/server'
import {
  createCollection,
  listCollectionsWithCounts,
  listPosts,
} from '@/lib/db/repo'

// Each collection ships its 4 most-recently-updated posts so the home
// grid can render a 2x2 thumbnail mosaic on each card. listPosts is
// already filterable by collection_id; we slice to 4 here.
export async function GET(): Promise<NextResponse> {
  const collections = listCollectionsWithCounts()
  const enriched = collections.map((c) => ({
    ...c,
    recent_posts: listPosts({ collection_id: c.id }).slice(0, 4),
  }))
  return NextResponse.json(enriched)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
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
  const collection = createCollection(name)
  return NextResponse.json(collection)
}
