// Puppeteer-based PNG export.
//
// Local-mode flow per request:
//   1. Fetch the post from SQLite.
//   2. Launch a browser (auto-installs Chromium on first run — see
//      lib/browser.ts).
//   3. For each slide: open /render/[postId]?slide=i, wait for
//      `window.__slideReady === true`, screenshot #nw-slide-root.
//   4. Zip everything, stash a thumbnail in ~/.redesign/assets/, update
//      the post row with the new thumbnail URL, return the zip blob.
//
// No auth, no render keys — the server only binds to localhost.

import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { CANVAS } from '@/lib/db/types'
import { NotFoundError, getPost, updatePost } from '@/lib/db/repo'
import { saveAssetBytesAtPath } from '@/lib/db/storage'
import { launchBrowser } from '@/lib/browser'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Chromium install on first run + N slides × ~3s each. Generous cap.
export const maxDuration = 600

function baseUrl(request: NextRequest): string {
  // Derive from the incoming request's host header — all traffic is
  // local so http + the same host Puppeteer sees on the next server is
  // the right target.
  const host = request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  return `${proto}://${host}`
}

export async function POST(request: NextRequest) {
  let body: { postId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  if (!body.postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
  }

  let post
  try {
    post = getPost(body.postId)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    throw err
  }

  const origin = baseUrl(request)
  const browser = await launchBrowser({
    viewport: { width: CANVAS.W, height: CANVAS.H, deviceScaleFactor: 2 },
  })
  const zip = new JSZip()
  let firstPng: Buffer | null = null

  // Render slides in parallel chunks. Each chunk opens its own
  // puppeteer pages so navigation + render run concurrently — that's
  // where the bulk of export time lives (one page-load + paint per
  // slide, ~2s each). CONCURRENCY=4 keeps memory bounded (each Chrome
  // page is ~80-120 MB) so a 20-slide carousel still fits in 8 GB.
  const CONCURRENCY = 4

  const renderSlide = async (i: number): Promise<Buffer> => {
    const page = await browser.newPage()
    try {
      page.setDefaultNavigationTimeout(60_000)
      page.setDefaultTimeout(60_000)
      const url = `${origin}/render/${post.id}?slide=${i}`
      await page.goto(url, { waitUntil: 'networkidle0' })
      await page.waitForFunction('window.__slideReady === true', { timeout: 45_000 })
      const el = await page.$('#nw-slide-root')
      if (!el) throw new Error(`Render route missing #nw-slide-root on slide ${i + 1}`)
      const shot = await el.screenshot({ type: 'png', omitBackground: false })
      return Buffer.from(shot)
    } finally {
      await page.close().catch(() => {})
    }
  }

  try {
    // Result array preserves slide order — Promise.all returns in input
    // order, so chunk by chunk we fill in the right indices.
    const pngs: Buffer[] = new Array(post.slides.length)
    for (let start = 0; start < post.slides.length; start += CONCURRENCY) {
      const batch = []
      for (let i = start; i < Math.min(start + CONCURRENCY, post.slides.length); i++) {
        batch.push(renderSlide(i).then((png) => ({ i, png })))
      }
      const settled = await Promise.all(batch)
      for (const { i, png } of settled) pngs[i] = png
    }
    // Stash slide 0 for the thumbnail save below; build the zip in
    // order using the canonical zero-padded filenames.
    firstPng = pngs[0] ?? null
    for (let i = 0; i < pngs.length; i++) {
      const fileName = `slide-${String(i + 1).padStart(2, '0')}.png`
      zip.file(fileName, pngs[i])
    }
  } finally {
    await browser.close().catch(() => {})
  }

  const zipBuf = await zip.generateAsync({ type: 'nodebuffer' })

  // Stash the first slide as the post's thumbnail under
  // ~/.redesign/assets/thumbnails/<postId>.png. Fire-and-forget so the
  // zip download isn't delayed.
  if (firstPng) {
    void (async () => {
      try {
        const saved = await saveAssetBytesAtPath(
          firstPng!,
          'image/png',
          `thumbnails/${post.id}.png`,
        )
        // Bust caches on the editor grid by appending a timestamp
        updatePost(post.id, {
          thumbnail_url: `${saved.file_url}?v=${Date.now()}`,
        })
      } catch (err) {
        console.error('[redesign] thumbnail save failed', err)
      }
    })()
  }

  return new NextResponse(new Uint8Array(zipBuf), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${post.id}.zip"`,
    },
  })
}
