// Ambient shim for the dev-only `puppeteer` package. Runtime uses
// `puppeteer-core` + @sparticuz/chromium-min (both real deps); the
// local dev branch in app/api/media/export/route.ts dynamic-imports
// `puppeteer`, which we don't ship with the package because its
// bundled Chromium is ~200 MB. Users who want local export can
// `npm install puppeteer` separately; this shim lets typecheck pass
// in either case.

declare module 'puppeteer'
