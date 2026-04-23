// GET  /api/posts         — list summaries
// POST /api/posts         — create
//
// Body for POST is passed straight through to repo.createPost — no
// field filtering. This is a single-user local app; the network is
// localhost only.

import { NextRequest, NextResponse } from 'next/server'
import {
  createPost,
  listPosts,
  type NewPostInput,
} from '@/lib/db/repo'
import { unwrapPostBody } from './_unwrap'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(listPosts())
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const raw = (await req.json()) as Record<string, unknown>
  const body = unwrapPostBody(raw) as NewPostInput
  const post = createPost(body)
  return NextResponse.json({ id: post.id, updated_at: post.updated_at })
}
