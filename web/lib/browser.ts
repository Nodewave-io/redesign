// Shared puppeteer-core launcher with lazy Chromium provisioning.
//
// The package ships WITHOUT a bundled Chromium to keep the tarball
// small (~15 MB vs ~200 MB with full puppeteer). On the first export /
// screenshot call we download Chrome into ~/.redesign/chromium/ via
// @puppeteer/browsers and cache it there for every subsequent run.
//
// Concurrency note: resolveBrowser() is cached as a singleton promise
// so parallel callers (MCP screenshot + editor Download in the same
// second) don't kick off two concurrent installs.

import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { REDESIGN_HOME } from './db/paths'

// Pinned at a known-good Chrome build. Bump when you test a newer one.
// Stable naming comes from @puppeteer/browsers' "stable" channel.
const CHROME_CACHE_DIR = join(REDESIGN_HOME, 'chromium')
const CHROME_BUILD_ID = 'stable'

type LaunchedBrowser = {
  newPage: () => Promise<PageHandle>
  close: () => Promise<void>
}

// Minimal subset of the puppeteer Page API we actually call. Keeps the
// launcher decoupled from the full puppeteer type namespace.
export type PageHandle = {
  setDefaultNavigationTimeout: (ms: number) => void
  setDefaultTimeout: (ms: number) => void
  close: () => Promise<void>
  goto: (url: string, opts?: { waitUntil?: string }) => Promise<unknown>
  waitForFunction: (expr: string, opts?: { timeout?: number }) => Promise<unknown>
  waitForSelector: (
    sel: string,
    opts?: { timeout?: number },
  ) => Promise<{
    boundingBox: () => Promise<{ width: number; height: number } | null>
    screenshot: (opts: {
      type?: 'png' | 'jpeg'
      quality?: number
      omitBackground?: boolean
    }) => Promise<Uint8Array>
  } | null>
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

let _executablePath: Promise<string> | null = null

// Resolve (install if missing) a Chromium binary under ~/.redesign/.
async function ensureChromium(): Promise<string> {
  if (_executablePath) return _executablePath
  _executablePath = (async () => {
    await mkdir(CHROME_CACHE_DIR, { recursive: true })
    // @puppeteer/browsers is the maintained tool for installing and
    // locating Chrome builds. Lazy-import so the module doesn't load
    // on every cold boot — only when a caller needs a browser.
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
    // `stable` resolves to an actual build id (e.g. 131.0.6778.264) —
    // we need the concrete id both to install and to compute the path.
    const platform = detectPlatform()
    const buildId = await resolveBuildId(Browser.CHROME, platform, CHROME_BUILD_ID)
    const candidate = computeExecutablePath({
      browser: 'chrome',
      buildId,
      cacheDir: CHROME_CACHE_DIR,
    })
    if (existsSync(candidate)) return candidate
    // Install — first run only. Logs "Downloading Chrome…" to stderr.
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

// @puppeteer/browsers wants a platform tag like 'mac-arm64' / 'linux'
// / 'win64'. Derive from node's process info.
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
    // --no-sandbox is the standard flag for running headless Chrome in
    // a local user context without root; safe here because the whole
    // app is single-user localhost.
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
}
