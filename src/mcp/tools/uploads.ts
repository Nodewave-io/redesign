// Image-upload tools — let Claude pull images into the asset library
// without needing the user to run the browser uploader.
//
//   media_upload_image_from_url — fetch a remote image, persist under
//     ~/.redesign/assets, register in media_assets.
//   media_screenshot_url         — headless Chrome, navigate, snap,
//     upload as an asset.
//
// Both tools create rows in media_assets so the result is discoverable
// via media_list_assets / media_search_assets.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { createAsset } from '../../db/repo.js'
import { removeStoredFile, saveAssetBytes } from '../../db/storage.js'

// Safety cap — protects against a Claude typo fetching a 500 MB ISO.
const MAX_BYTES = 20 * 1024 * 1024

export function registerUploadTools(server: McpServer): void {
  server.registerTool(
    'media_upload_image_from_url',
    {
      description:
        "Fetch a public image URL, save it to the local asset library (~/.redesign/assets), and register a media_assets row. Returns the new asset id + file_url. Max 20 MB. Categories default to ['photos'].",
      inputSchema: {
        url: z.string().url(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().max(1000).optional(),
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    withLogging(
      'media_upload_image_from_url',
      async (args: {
        url: string
        name?: string
        description?: string
        categories?: string[]
        tags?: string[]
      }) => {
        const res = await fetch(args.url)
        if (!res.ok) throw new Error(`download failed: ${res.status} ${res.statusText}`)
        const contentLength = Number(res.headers.get('content-length') ?? 0)
        if (contentLength && contentLength > MAX_BYTES) {
          throw new Error(`image too large (${contentLength} bytes > ${MAX_BYTES} cap)`)
        }
        const ab = await res.arrayBuffer()
        const bytes = Buffer.from(ab)
        if (bytes.byteLength > MAX_BYTES) {
          throw new Error(`image too large (${bytes.byteLength} bytes)`)
        }
        const mimeType =
          (res.headers.get('content-type') ?? '').split(';')[0] || 'image/png'
        const uploaded = await registerImage(bytes, {
          mimeType,
          name: args.name ?? nameFromUrl(args.url),
          description: args.description ?? null,
          categories: args.categories ?? ['photos'],
          tags: args.tags ?? [],
        })
        return textJson(uploaded)
      },
    ),
  )

  server.registerTool(
    'media_screenshot_url',
    {
      description:
        "Open a URL in headless Chrome, screenshot it (optionally scoped to a CSS selector), save under ~/.redesign/assets as a media_assets row. Useful for turning a live page into a slide-ready image. Waits for networkidle0 first; also accepts a `waitFor` CSS selector.",
      inputSchema: {
        url: z.string().url(),
        selector: z.string().optional(),
        waitFor: z.string().optional(),
        width: z.number().int().min(200).max(4000).optional(),
        height: z.number().int().min(200).max(4000).optional(),
        fullPage: z.boolean().optional(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().max(1000).optional(),
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    withLogging(
      'media_screenshot_url',
      async (args: {
        url: string
        selector?: string
        waitFor?: string
        width?: number
        height?: number
        fullPage?: boolean
        name?: string
        description?: string
        categories?: string[]
        tags?: string[]
      }) => {
        const viewportW = args.width ?? 1280
        const viewportH = args.height ?? 800

        // puppeteer is resolved from the host nw-site install for now;
        // once the standalone package ships, list it as a peer dep or
        // ship the chromium locator in the CLI.
        const { default: puppeteer } = (await import('puppeteer')) as unknown as {
          default: {
            launch: (opts: unknown) => Promise<{
              newPage: () => Promise<{
                setDefaultTimeout: (n: number) => void
                goto: (u: string, o: unknown) => Promise<unknown>
                waitForSelector: (s: string, o: unknown) => Promise<unknown>
                $: (s: string) => Promise<{
                  boundingBox: () => Promise<{ width: number; height: number } | null>
                  screenshot: (o: unknown) => Promise<Uint8Array>
                } | null>
                screenshot: (o: unknown) => Promise<Uint8Array>
              }>
              close: () => Promise<void>
            }>
          }
        }
        const browser = await puppeteer.launch({
          headless: true,
          defaultViewport: { width: viewportW, height: viewportH, deviceScaleFactor: 2 },
        })
        let bytes: Buffer
        let finalW = viewportW
        let finalH = viewportH
        try {
          const page = await browser.newPage()
          page.setDefaultTimeout(45_000)
          await page.goto(args.url, { waitUntil: 'networkidle0' })
          if (args.waitFor) {
            await page.waitForSelector(args.waitFor, { timeout: 30_000 })
          }
          if (args.selector) {
            const el = await page.$(args.selector)
            if (!el) throw new Error(`selector not found: ${args.selector}`)
            const box = await el.boundingBox()
            if (box) {
              finalW = Math.round(box.width)
              finalH = Math.round(box.height)
            }
            bytes = Buffer.from(await el.screenshot({ type: 'png' }))
          } else {
            bytes = Buffer.from(
              await page.screenshot({ type: 'png', fullPage: args.fullPage ?? false }),
            )
          }
        } finally {
          await browser.close().catch(() => {})
        }

        const uploaded = await registerImage(bytes, {
          mimeType: 'image/png',
          name: args.name ?? `Screenshot · ${nameFromUrl(args.url)}`,
          description: args.description ?? `Screenshot of ${args.url}`,
          categories: args.categories ?? ['screenshots'],
          tags: args.tags ?? [],
          width: finalW * 2,
          height: finalH * 2,
        })
        return textJson(uploaded)
      },
    ),
  )
}

// ─── Shared helper ──────────────────────────────────────────────────

type RegisterInput = {
  mimeType: string
  name: string
  description: string | null
  categories: string[]
  tags: string[]
  width?: number
  height?: number
}

type RegisterOutput = {
  id: string
  file_url: string
  storage_path: string
}

async function registerImage(
  bytes: Buffer,
  input: RegisterInput,
): Promise<RegisterOutput> {
  const saved = await saveAssetBytes(bytes, input.mimeType)
  try {
    const asset = createAsset({
      kind: 'image',
      name: input.name,
      description: input.description,
      usage_notes: null,
      categories: input.categories,
      tags: input.tags,
      file_url: saved.file_url,
      storage_path: saved.storage_path,
      mime_type: input.mimeType,
      width: input.width ?? null,
      height: input.height ?? null,
      source_code: null,
    })
    return {
      id: asset.id,
      file_url: asset.file_url!,
      storage_path: asset.storage_path!,
    }
  } catch (err) {
    // Best-effort cleanup so a failed insert doesn't leave an orphan blob.
    await removeStoredFile(saved.storage_path).catch(() => {})
    throw err
  }
}

function nameFromUrl(url: string): string {
  try {
    const u = new URL(url)
    const last = u.pathname.split('/').filter(Boolean).pop() ?? u.hostname
    return decodeURIComponent(last).slice(0, 120) || u.hostname
  } catch {
    return url.slice(0, 120)
  }
}
