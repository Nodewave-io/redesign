// Internal endpoint the headless /render page calls to fetch post JSON.
//
// Localhost-only single-user mode → no auth, no render key. We keep
// the endpoint (instead of having the render page hit /api/posts/:id
// directly) so the response shape stays in the legacy row form the
// render page expects (slides wrapper field, etc.), and a future
// migration can swap in a different backend without touching the
// render page.

import { NextRequest, NextResponse } from 'next/server'
import { getPost, NotFoundError } from '@/lib/db/repo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  if (!postId) {
    return NextResponse.json({ error: 'missing postId' }, { status: 400 })
  }
  try {
    const post = getPost(postId)
    // Reshape to the legacy "row" format the render page / puppeteer
    // pipeline already reads (slides is a wrapper object containing
    // `slides` + `layers`). Cheaper than touching the render page.
    const row = {
      id: post.id,
      title: post.title,
      page_count: post.page_count,
      aspect_ratio: post.aspect_ratio,
      theme: post.theme,
      slides: { slides: post.slides, layers: post.layers },
      thumbnail_url: post.thumbnail_url,
      created_at: post.created_at,
      updated_at: post.updated_at,
    }
    return NextResponse.json(row, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
