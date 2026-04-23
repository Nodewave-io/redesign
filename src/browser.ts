// Shared puppeteer-core launcher with lazy Chromium provisioning.
//
// Ships WITHOUT a bundled Chromium (keeps the package tarball small).
// On first MCP screenshot / CLI export call we download Chrome into
// ~/.redesign/chromium/ via @puppeteer/browsers and cache for reuse.
// Subsequent calls hit the cached binary directly.
//
// Mirror of web/lib/browser.ts — same logic, different package context.
// When you change one, update the other.

import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { REDESIGN_HOME } from './db/paths.js'

const CHROME_CACHE_DIR = join(REDESIGN_HOME, 'chromium')
const CHROME_BUILD_TAG = 'stable'

export type PageHandle = {
  setDefaultNavigationTimeout: (ms: number) => void
  setDefaultTimeout: (ms: number) => void
  close: () => Promise<void>
  goto: (url: string, opts?: { waitUntil?: string }) => Promise<unknown>
  waitForFunction: (expr: string, opts?: { timeout?: number }) => Promise<unknown>
  $: (sel: string) => Promise<{
    boundingBox: () => Promise<{ width: number; height: number } | null>
    screenshot: (opts: {
      type?: 'png' | 'jpeg'
      quality?: number
      omitBackground?: boolean
    }) => Promise<Uint8Array>
  } | null>
  screenshot: (opts: {
    type?: 'png' | 'jpeg'
    quality?: number
    fullPage?: boolean
  }) => Promise<Uint8Array>
}

type LaunchedBrowser = {
  newPage: () => Promise<PageHandle>
  close: () => Promise<void>
}

let _executablePath: Promise<string> | null = null

async function ensureChromium(): Promise<string> {
  if (_executablePath) return _executablePath
  _executablePath = (async () => {
    await mkdir(CHROME_CACHE_DIR, { recursive: true })
    const { install, computeExecutablePath, resolveBuildId, Browser } =
      (await import('@puppeteer/browsers')) as unknown as {
        install: (opts: {
          browser: 'chrome'
          buildId: string
          cacheDir: string
        }) => Promise<{ executablePath: string; buildId: string }>
        computeExecutablePath: (opts: {
          browser: 'chrome'
          buildId: string
          cacheDir: string
        }) => string
        resolveBuildId: (
          browser: 'chrome',
          platform: string,
          tag: string,
        ) => Promise<string>
        Browser: { CHROME: 'chrome' }
      }
    const platform = detectPlatform()
    const buildId = await resolveBuildId(Browser.CHROME, platform, CHROME_BUILD_TAG)
    const candidate = computeExecutablePath({
      browser: 'chrome',
      buildId,
      cacheDir: CHROME_CACHE_DIR,
    })
    if (existsSync(candidate)) return candidate
    console.error(`[redesign] installing Chrome (${buildId}) to ${CHROME_CACHE_DIR} …`)
    const { executablePath } = await install({
      browser: 'chrome',
      buildId,
      cacheDir: CHROME_CACHE_DIR,
    })
    return executablePath
  })()
  return _executablePath
}

function detectPlatform(): string {
  if (process.platform === 'darwin') {
    return process.arch === 'arm64' ? 'mac_arm' : 'mac'
  }
  if (process.platform === 'linux') return 'linux'
  if (process.platform === 'win32') return process.arch === 'x64' ? 'win64' : 'win32'
  throw new Error(`unsupported platform: ${process.platform}`)
}

export async function launchBrowser(opts?: {
  viewport?: { width: number; height: number; deviceScaleFactor?: number }
}): Promise<LaunchedBrowser> {
  const executablePath = await ensureChromium()
  const puppeteer = (await import('puppeteer-core')) as unknown as {
    default: {
      launch: (o: {
        headless: boolean
        executablePath: string
        defaultViewport: { width: number; height: number; deviceScaleFactor?: number }
        args?: string[]
      }) => Promise<LaunchedBrowser>
    }
  }
  return puppeteer.default.launch({
    headless: true,
    executablePath,
    defaultViewport: opts?.viewport ?? { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
}
