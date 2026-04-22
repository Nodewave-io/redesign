// Puppeteer-based PNG export.
//
// For each slide we:
//   1. Issue a short-lived render key
//   2. Navigate the headless browser to /admin/media/render/[id]
//   3. Wait for window.__slideReady === true
//   4. Screenshot #nw-slide-root as PNG
//   5. Package all slides into a zip, upload to media-exports, return
//      the zip to the client for direct download.
//
// Puppeteer runs on Vercel via @sparticuz/chromium-min (Chrome shipped
// as a download URL to keep the function bundle small). Locally we use
// the full `puppeteer` package which bundles its own Chromium.
//
// Scale: we render at the native CANVAS size (1080×1350) with a
// deviceScaleFactor of 2 so the output PNG is 2160×2700 — Instagram's
// native resolution, Photoshop-ish quality.

import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '@/lib/supabase'
import { CANVAS, postFromRow, type MediaPostRow } from '@/app/admin/media/_lib/types'
import { issueRenderKey, revokeRenderKey } from './render-key'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Puppeteer cold start + N slides × ~3s each. Generous cap.
export const maxDuration = 300

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '')
  if (!token) return false
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data: { user }, error } = await supabase.auth.getUser(token)
    return !error && !!user
  } catch {
    return false
  }
}

// ─── Browser lifecycle ────────────────────────────────────────────
// Launch one Chrome per request (simpler than managing a pool) and
// reuse a single page across slides to avoid re-parsing the bundle.

async function launchBrowser() {
  // In production (Vercel), use puppeteer-core + sparticuz chromium.
  // In local dev, fall back to the full puppeteer package.
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const { default: chromium } = await import('@sparticuz/chromium-min')
    const puppeteer = await import('puppeteer-core')
    // The -min variant needs a remote Chromium archive URL. Ship the
    // matching pinned build; update when bumping the dep.
    const remoteExecutablePath = `https://github.com/Sparticuz/chromium/releases/download/v140.0.0/chromium-v140.0.0-pack.x64.tar`
    return puppeteer.default.launch({
      args: chromium.args,
      defaultViewport: { width: CANVAS.W, height: CANVAS.H, deviceScaleFactor: 2 },
      executablePath: await chromium.executablePath(remoteExecutablePath),
      headless: true,
    })
  }
  const puppeteer = await import('puppeteer')
  return puppeteer.default.launch({
    headless: true,
    defaultViewport: { width: CANVAS.W, height: CANVAS.H, deviceScaleFactor: 2 },
  })
}

function baseUrl(request: NextRequest): string {
  // Prefer explicitly configured URL for stability. In local dev,
  // derive from the incoming request's host header.
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl) return envUrl.replace(/\/$/, '')
  const host = request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  return `${proto}://${host}`
}

// ─── Handler ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  if (!body.postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('media_posts')
    .select('*')
    .eq('id', body.postId)
    .single()
  if (error || !data) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  const post = postFromRow(data as MediaPostRow)

  const renderKey = issueRenderKey(post.id)
  const origin = baseUrl(request)

  const browser = await launchBrowser()
  const zip = new JSZip()
  const uploads: { path: string; data: Buffer }[] = []
  let firstPng: Buffer | null = null

  try {
    const page = await browser.newPage()
    // Fail fast if the render route throws so we don't hang.
    page.setDefaultNavigationTimeout(60_000)
    page.setDefaultTimeout(60_000)

    for (let i = 0; i < post.slides.length; i++) {
      const url = `${origin}/admin/media/render/${post.id}?slide=${i}&key=${renderKey}`
      await page.goto(url, { waitUntil: 'networkidle0' })
      await page.waitForFunction('window.__slideReady === true', { timeout: 45_000 })
      // Screenshot the explicit element so any wrapper DOM doesn't
      // bleed into the output.
      const el = await page.$('#nw-slide-root')
      if (!el) throw new Error(`Render route missing #nw-slide-root on slide ${i + 1}`)
      const shot = await el.screenshot({ type: 'png', omitBackground: false })
      const png = Buffer.from(shot)
      if (!firstPng) firstPng = png
      const fileName = `slide-${String(i + 1).padStart(2, '0')}.png`
      zip.file(fileName, png)
      uploads.push({ path: `${post.id}/${fileName}`, data: png })
    }
  } finally {
    await browser.close().catch(() => {})
    revokeRenderKey(renderKey)
  }

  const zipBuf = await zip.generateAsync({ type: 'nodebuffer' })

  // Background uploads so the user's zip download isn't delayed.
  ;(async () => {
    try {
      for (const up of uploads) {
        await admin.storage
          .from('media-exports')
          .upload(up.path, up.data, { contentType: 'image/png', upsert: true })
      }
      await admin.storage
        .from('media-exports')
        .upload(`${post.id}/post.zip`, zipBuf, {
          contentType: 'application/zip',
          upsert: true,
        })
      if (firstPng) {
        const thumbPath = `${post.id}/thumb.png`
        await admin.storage
          .from('media-exports')
          .upload(thumbPath, firstPng, { contentType: 'image/png', upsert: true })
        const { data: pub } = admin.storage
          .from('media-exports')
          .getPublicUrl(thumbPath)
        await admin
          .from('media_posts')
          .update({ thumbnail_url: `${pub.publicUrl}?v=${Date.now()}` })
          .eq('id', post.id)
      }
    } catch (err) {
      console.error('media export background upload failed', err)
    }
  })()

  return new NextResponse(new Uint8Array(zipBuf), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${post.id}.zip"`,
    },
  })
}
