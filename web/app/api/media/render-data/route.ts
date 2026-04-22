// Internal endpoint the headless /admin/media/render page calls to
// fetch the post JSON. Authenticated by a per-export render key so
// Puppeteer (which can't easily ship the admin's Supabase session)
// can still read the data.

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { consumeRenderKey } from '../export/render-key'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  const key = searchParams.get('key')
  if (!postId || !key) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }
  if (!consumeRenderKey(key, postId)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('media_posts')
    .select('*')
    .eq('id', postId)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
