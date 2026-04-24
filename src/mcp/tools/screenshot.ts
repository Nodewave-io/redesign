// media_screenshot + media_screenshot_strip — render a slide (or all
// slides) to PNG/JPEG by driving a headless Chrome at the local
// editor's render page.
//
// Flow:
//   1. Read port from ~/.redesign/config.json (written by `redesign
//      start`). Fall back to 3000.
//   2. Launch puppeteer-core + the managed Chrome from ~/.redesign/
//      chromium (installed on first call via @puppeteer/browsers).
//   3. Navigate to http://127.0.0.1:<port>/render/<postId>?slide=<i>
//      and wait for `window.__slideReady === true`.
//   4. Screenshot #nw-slide-root and return as an inline MCP image
//      content block.
//
// Returns an error with a pointer to `redesign start` if the editor
// server isn't reachable — Claude needs the web process running to
// render slides.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { getPost } from '../../db/repo.js'
import { launchBrowser } from '../../browser.js'
import { discoverServerUrl } from '../../config.js'

// Default render quality — 1 = exact canvas size (1000×1250 CSS px).
// The render page's #nw-slide-root has deviceScaleFactor=2 applied
// during export, so scale=2 here gives you the IG-ready 2160×2700 PNG.
const DEFAULT_SCALE = 1

export function registerScreenshotTool(server: McpServer): void {
  server.registerTool(
    'media_screenshot',
    {
      description:
        'Render a single slide to an inline PNG/JPEG. Returns an image content block you can inspect directly. Requires `redesign start` to be running (uses the editor\'s /render route under the hood). First call downloads Chromium into ~/.redesign/chromium (one-time, ~2 min).',
      inputSchema: {
        id: z.string().uuid(),
        slideIndex: z.number().int().min(0),
        format: z.enum(['png', 'jpeg']).optional(),
        quality: z.number().int().min(1).max(100).optional(),
        scale: z.number().min(0.5).max(3).optional(),
      },
    },
    withLogging(
      'media_screenshot',
      async (args: {
        id: string
        slideIndex: number
        format?: 'png' | 'jpeg'
        quality?: number
        scale?: number
      }) => {
        const post = getPost(args.id)
        if (args.slideIndex >= post.slides.length) {
          throw new Error(
            `slideIndex ${args.slideIndex} out of range (post has ${post.slides.length} slides)`,
          )
        }
        const format = args.format ?? 'png'
        const scale = args.scale ?? DEFAULT_SCALE
        const png = await captureSlide({
          postId: args.id,
          slideIndex: args.slideIndex,
          scale,
          format,
          quality: args.quality,
        })
        const b64 = Buffer.from(png).toString('base64')
        return {
          content: [
            {
              type: 'image' as const,
              data: b64,
              mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
            },
          ],
        }
      },
    ),
  )

  server.registerTool(
    'media_screenshot_strip',
    {
      description:
        "Render every slide side-by-side as one composite image. Useful for 'show me the whole post at a glance' without issuing N screenshot calls. Same editor-server + Chromium requirements as media_screenshot.",
      inputSchema: {
        id: z.string().uuid(),
        format: z.enum(['png', 'jpeg']).optional(),
        quality: z.number().int().min(1).max(100).optional(),
        scale: z.number().min(0.5).max(3).optional(),
      },
    },
    withLogging(
      'media_screenshot_strip',
      async (args: {
        id: string
        format?: 'png' | 'jpeg'
        quality?: number
        scale?: number
      }) => {
        const post = getPost(args.id)
        const format = args.format ?? 'jpeg'
        const scale = args.scale ?? DEFAULT_SCALE
        // Capture each slide sequentially and concatenate horizontally
        // via a tiny in-memory canvas composition. We avoid piping
        // through sharp/jimp to keep the dep surface small — puppeteer
        // itself can render the composite by navigating to a URL that
        // renders all slides, but we don't have that route today.
        const slides: Uint8Array[] = []
        for (let i = 0; i < post.slides.length; i++) {
          slides.push(
            await captureSlide({
              postId: post.id,
              slideIndex: i,
              scale,
              format,
              quality: args.quality,
            }),
          )
        }
        // Simplest "strip": return the first slide only with a note.
        // TODO: swap for a true composite once we add a /render/strip
        // route that paints all slides side-by-side in one DOM.
        const first = slides[0] ?? new Uint8Array(0)
        const b64 = Buffer.from(first).toString('base64')
        return {
          content: [
            {
              type: 'text' as const,
              text: `Rendered ${slides.length} slide(s). Strip composite is not yet implemented, returning slide 1. Use media_screenshot(slideIndex: N) for individual slides.`,
            },
            {
              type: 'image' as const,
              data: b64,
              mimeType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
            },
          ],
        }
      },
    ),
  )
}

type CaptureInput = {
  postId: string
  slideIndex: number
  scale: number
  format: 'png' | 'jpeg'
  quality?: number
}

// Drive puppeteer through one slide capture. Kept off the public tool
// surface so the two registered tools share the exact timing + error
// handling instead of drifting.
async function captureSlide(input: CaptureInput): Promise<Uint8Array> {
  // Auto-discover the editor's actual port — config.json can be stale
  // if the user started the editor via `next dev` directly or if a
  // previous session's port was different. discoverServerUrl probes
  // the configured port first, then walks the standard grid (3000,
  // 3100, 3200…) and self-heals config when it finds a live one.
  const origin = await discoverServerUrl()
  // Fail fast + clearly when the editor server isn't up.
  try {
    const res = await fetch(`${origin}/api/posts/${input.postId}`, {
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) {
      throw new Error(
        `Editor server at ${origin} returned ${res.status}. Make sure \`redesign start\` is running.`,
      )
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(
      `Can't reach editor at ${origin}. Is \`redesign start\` running? (${msg})`,
    )
  }

  // CANVAS width × height at 1000×1250 — same as export. Scale >1
  // gives retina output; scale <1 a quick low-res thumb.
  const W = Math.round(1000 * input.scale)
  const H = Math.round(1250 * input.scale)
  const browser = await launchBrowser({
    viewport: { width: W, height: H, deviceScaleFactor: input.scale },
  })
  try {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(45_000)
    page.setDefaultTimeout(45_000)
    const url = `${origin}/render/${input.postId}?slide=${input.slideIndex}`
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.waitForFunction('window.__slideReady === true', { timeout: 30_000 })
    const el = await page.$('#nw-slide-root')
    if (!el) {
      throw new Error(
        `Render page missing #nw-slide-root. The editor may not be serving the /render route.`,
      )
    }
    return await el.screenshot({
      type: input.format,
      quality: input.format === 'jpeg' ? input.quality ?? 85 : undefined,
      omitBackground: false,
    })
  } finally {
    await browser.close().catch(() => {})
  }
}
