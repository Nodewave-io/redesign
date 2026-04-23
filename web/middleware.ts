// Request logger. The production standalone server is silent by
// default — fine for a deployed app, terrible for a local tool the
// user is running while debugging. Print one line per request so
// `redesign start`'s console mirrors what `next dev` would show.
//
// Set REDESIGN_QUIET=1 to suppress (useful if a future test harness
// hits the server thousands of times and we don't want the noise).

import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  if (process.env.REDESIGN_QUIET !== '1') {
    const url = new URL(req.url)
    // TODO(v0.2): redact querystring values when REDESIGN_PUBLIC=1.
    // Today redesign binds to 127.0.0.1 only and the URLs carry no
    // secrets, so logging `?…` raw is safe. If a future user fronts
    // the editor with ngrok/Cloudflared, signed URLs and tokens
    // would land in their terminal logs. Replace url.search with
    // (url.search ? '?…' : '') in that mode.
    // eslint-disable-next-line no-console
    console.log(` ${req.method} ${url.pathname}${url.search}`)
  }
  return NextResponse.next()
}

// Match every route except Next's internal asset routes (which would
// otherwise spam the log on every page load with chunk fetches).
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
