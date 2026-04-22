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

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(listPosts())
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as NewPostInput
  const post = createPost(body)
  return NextResponse.json({ id: post.id, updated_at: post.updated_at })
}
