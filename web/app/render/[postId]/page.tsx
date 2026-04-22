'use client'

// Headless render route. Renders a SINGLE slide at its native
// 1080×1350 dimensions with no chrome so Puppeteer can screenshot
// the `#nw-slide-root` element and get a pixel-perfect PNG.
//
// Local-mode: no render key — the server binds to localhost only, so
// any request reaching this page is trusted. The page publishes
// `window.__slideReady = true` once the slide has laid out + fonts +
// images have loaded; Puppeteer waits on that before screenshotting.

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { CANVAS, MediaPost, postFromRow, type MediaPostRow } from '../../_lib/types'
import { LayerNode, SlideBackground } from '../../_lib/render'

declare global {
  interface Window {
    __slideReady?: boolean
  }
}

export default function RenderSlide() {
  const params = useParams()
  const search = useSearchParams()
  const postId = String(params.postId)
  const slideIndex = parseInt(search.get('slide') ?? '0', 10) || 0

  const [post, setPost] = useState<MediaPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(
          `/api/media/render-data?postId=${encodeURIComponent(postId)}`,
          { cache: 'no-store' },
        )
        if (!res.ok) {
          setError(`HTTP ${res.status}`)
          return
        }
        const json = (await res.json()) as MediaPostRow
        setPost(postFromRow(json))
      } catch (err: any) {
        setError(err?.message ?? String(err))
      }
    })()
  }, [postId])

  // Once post is loaded, wait for fonts + any <img> in the DOM before
  // signaling puppeteer it can screenshot.
  useEffect(() => {
    if (!post) return
    let cancelled = false
    const run = async () => {
      try {
        if (typeof document !== 'undefined' && document.fonts?.ready) {
          await document.fonts.ready
        }
      } catch {
        /* ignore */
      }
      // Give React a tick so layer code has transpiled + painted.
      await new Promise((r) => requestAnimationFrame(() => r(null)))
      // Wait for all <img> to load (or error).
      const imgs = Array.from(document.querySelectorAll('img'))
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((res) => {
              if (img.complete) return res()
              img.addEventListener('load', () => res())
              img.addEventListener('error', () => res())
            }),
        ),
      )
      // Extra paint cycle so text metrics stabilise.
      await new Promise((r) => setTimeout(r, 80))
      if (!cancelled) window.__slideReady = true
    }
    run()
    return () => {
      cancelled = true
    }
  }, [post])

  if (error) {
    return <div style={{ padding: 24, color: 'red', fontFamily: 'monospace' }}>Error: {error}</div>
  }
  if (!post) {
    return null
  }

  const slide = post.slides[slideIndex]
  if (!slide) {
    return <div style={{ padding: 24 }}>No such slide</div>
  }

  // Layers that touch this slide (either start here or bleed through).
  const visible = post.layers.filter((l) => {
    const span = l.spans ?? 1
    return slideIndex >= l.slideIndex && slideIndex < l.slideIndex + span
  })

  // The strip position of this slide is `slideIndex * CANVAS.W`. Each
  // layer's x is expressed relative to its origin slide, so to draw
  // a layer inside this slide's frame we translate by
  // (layer.slideIndex - slideIndex) * CANVAS.W.
  return (
    <div
      id="nw-slide-root"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: CANVAS.W,
        height: CANVAS.H,
        background: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <SlideBackground theme={post.theme} background={slide.background} />
      {visible.map((layer) => (
        <div
          key={layer.id}
          style={{
            position: 'absolute',
            left: layer.x + (layer.slideIndex - slideIndex) * CANVAS.W,
            top: layer.y,
            width: layer.w,
            height: layer.h,
            opacity: layer.opacity ?? 1,
            transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
            transformOrigin: 'center center',
            zIndex: layer.z ?? 0,
          }}
        >
          <LayerNode
            layer={{ ...layer, x: 0, y: 0, slideIndex: 0, rotation: 0 }}
            theme={post.theme}
          />
        </div>
      ))}
    </div>
  )
}
