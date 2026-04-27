// GET  /api/posts         — list summaries
// POST /api/posts         — create
//
// Body for POST is passed straight through to repo.createPost — no
// field filtering. This is a single-user local app; the network is
// localhost only.

import { NextRequest, NextResponse } from 'next/server'
import {
  createPost,
  getCollection,
  listPosts,
  NotFoundError,
  type NewPostInput,
} from '@/lib/db/repo'
import { unwrapPostBody } from './_unwrap'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const collectionId = req.nextUrl.searchParams.get('collection_id') ?? undefined
  return NextResponse.json(
    listPosts(collectionId ? { collection_id: collectionId } : undefined),
  )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const raw = (await req.json()) as Record<string, unknown>
  const body = unwrapPostBody(raw) as NewPostInput
  if (!body.collection_id) {
    return NextResponse.json(
      { error: 'collection_id is required' },
      { status: 400 },
    )
  }
  // Validate the collection exists before inserting so a bad id surfaces
  // as a friendly 400 instead of a SQLite "FOREIGN KEY constraint failed"
  // 500 from the FK on media_posts.collection_id.
  try {
    getCollection(body.collection_id)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { error: `collection_id ${body.collection_id} does not exist` },
        { status: 400 },
      )
    }
    throw err
  }
  const post = createPost(body)
  return NextResponse.json({ id: post.id, updated_at: post.updated_at })
}
