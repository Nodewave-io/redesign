'use client'

// Injects @font-face rules for every font under ~/.redesign/fonts/ by
// fetching /api/fonts on mount. Mounted once in the root layout so
// every page (editor, home, render) sees the same registered fonts.
//
// The headless render route awaits document.fonts.ready before letting
// puppeteer screenshot, so as long as @font-face is added to the
// stylesheet before that wait, exports get the user's typeface too.
//
// We render <link rel="preload" as="font" /> for each font as well so
// the browser starts the network fetch immediately rather than waiting
// for the CSS rule to be evaluated and for a glyph to actually be
// requested. Skipping this would leave the first paint of a slide in
// the fallback font for a beat.

import { useEffect, useState } from 'react'

type UserFont = {
  family: string
  file: string
  format: 'truetype' | 'opentype' | 'woff' | 'woff2'
  mime: string
}

// Custom event the upload modal + delete handler dispatch after they
// hit /api/fonts. UserFonts listens and refetches so the @font-face
// registry stays in sync with the on-disk folder without forcing the
// user to hard-refresh.
export const FONTS_CHANGED_EVENT = 'redesign:fonts-changed'

export function UserFonts() {
  const [fonts, setFonts] = useState<UserFont[]>([])

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetch('/api/fonts')
        .then((r) => (r.ok ? (r.json() as Promise<UserFont[]>) : []))
        .then((list) => {
          if (!cancelled) setFonts(list)
        })
        .catch(() => {
          if (!cancelled) setFonts([])
        })
    }
    load()
    window.addEventListener(FONTS_CHANGED_EVENT, load)
    return () => {
      cancelled = true
      window.removeEventListener(FONTS_CHANGED_EVENT, load)
    }
  }, [])

  if (fonts.length === 0) return null

  // CSS family names need quoting if they contain spaces or special
  // chars. Escape any embedded double-quotes defensively.
  const css = fonts
    .map((f) => {
      const family = `"${f.family.replace(/"/g, '\\"')}"`
      const url = `/api/fonts/${encodeURIComponent(f.file)}`
      return `@font-face { font-family: ${family}; src: url("${url}") format("${f.format}"); font-display: swap; }`
    })
    .join('\n')

  return (
    <>
      {fonts.map((f) => (
        <link
          key={f.file}
          rel="preload"
          as="font"
          type={f.mime}
          href={`/api/fonts/${encodeURIComponent(f.file)}`}
          crossOrigin="anonymous"
        />
      ))}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  )
}
