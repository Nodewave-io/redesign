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

  try {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(60_000)
    page.setDefaultTimeout(60_000)

    for (let i = 0; i < post.slides.length; i++) {
      const url = `${origin}/render/${post.id}?slide=${i}`
      await page.goto(url, { waitUntil: 'networkidle0' })
      await page.waitForFunction('window.__slideReady === true', { timeout: 45_000 })
      const el = await page.$('#nw-slide-root')
      if (!el) throw new Error(`Render route missing #nw-slide-root on slide ${i + 1}`)
      const shot = await el.screenshot({ type: 'png', omitBackground: false })
      const png = Buffer.from(shot)
      if (!firstPng) firstPng = png
      const fileName = `slide-${String(i + 1).padStart(2, '0')}.png`
      zip.file(fileName, png)
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
