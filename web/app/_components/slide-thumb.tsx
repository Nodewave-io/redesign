'use client'

// Reusable thumbnail of a post's first slide. Scales the full
// 1000x1250 canvas down to fit any container while keeping layer
// coordinates truthful. Used by the post grid (full size) and by the
// collection card (4 of these in a 2x2 grid, each at quarter size).

import { useLayoutEffect, useRef, useState } from 'react'
import { CANVAS, type Layer, type Slide } from '@/app/_lib/types'
import { LayerNode, SlideBackground } from '@/app/_lib/render'

export type SlideThumbPost = {
  theme: 'dark' | 'light'
  slides: { slides: Slide[]; layers: Layer[] } | null
}

export function SlideThumb({
  post,
  emptyLabel = 'Empty',
}: {
  post: SlideThumbPost
  emptyLabel?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const ratioW = el.clientWidth / CANVAS.W
      const ratioH = el.clientHeight / CANVAS.H
      // Tiny overshoot so sub-pixel rounding never leaves a gap; the
      // outer container's overflow:hidden trims the excess.
      setScale(Math.max(ratioW, ratioH) + 0.002)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const slides = post.slides?.slides ?? []
  const layers = post.slides?.layers ?? []
  const slide0 = slides[0]
  const onFirst = layers.filter((l) => {
    const span = l.spans ?? 1
    return l.slideIndex <= 0 && l.slideIndex + span > 0
  })

  const empty = !slide0 || onFirst.length === 0

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      {scale > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CANVAS.W,
            height: CANVAS.H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <SlideBackground theme={post.theme} background={slide0?.background} />
          {onFirst.map((layer) => (
            <div
              key={layer.id}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: layer.z ?? 0,
              }}
            >
              <LayerNode layer={layer} theme={post.theme} />
            </div>
          ))}
        </div>
      )}
      {empty && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="text-[10px]"
            style={{
              color:
                post.theme === 'dark'
                  ? 'rgba(245,245,245,0.4)'
                  : 'rgba(24,18,15,0.35)',
            }}
          >
            {emptyLabel}
          </p>
        </div>
      )}
    </div>
  )
}
