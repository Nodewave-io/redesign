'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { editor, useEditorState } from '../_lib/store'
import { CANVAS, themeColors } from '../_lib/types'
import type { Layer } from '../_lib/types'
import { LayerNode, SlideBackground } from '../_lib/render'

const STRIP_GAP = 0 // IG-style continuous roll — slides touch

export function Canvas() {
  const { post, selectedLayerId, viewMode, currentSlide } = useEditorState()
  const colors = themeColors(post.theme)

  // Two modes:
  //  • carousel — auto-fit a single slide, no scroll, no manual zoom.
  //  • stitched — user can pan horizontally and shift+wheel to zoom.
  // `autoScale` is the fit-to-viewport scale (recomputed on resize).
  // `userZoom` overrides it once the user has zoomed manually.
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [autoScale, setAutoScale] = useState(0.5)
  const [userZoom, setUserZoom] = useState<number | null>(null)
  const [panActive, setPanActive] = useState(false)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      const visiblePages = viewMode === 'carousel' ? 1 : post.slides.length
      const totalCanvasW =
        CANVAS.W * visiblePages + STRIP_GAP * Math.max(0, visiblePages - 1)
      const availW = rect.width - 48
      // Carousel reserves extra vertical room so the floating
      // Stitched/Carousel toggle (top) and the pagination-dots pill
      // (bottom) sit outside the slide instead of overlapping it.
      const availH = rect.height - (viewMode === 'carousel' ? 160 : 48)
      const s = Math.min(availW / totalCanvasW, availH / CANVAS.H)
      setAutoScale(Math.max(0.05, s))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [viewMode, post.slides.length])

  // Whenever the user enters carousel mode, drop any manual zoom so
  // the slide refits cleanly, and jump back to the first slide so the
  // reader's reading order is preserved. Also reset the outer
  // container's scroll position — otherwise, if the user had panned
  // the stitched view somewhere off-center, the carousel's transform-
  // based centering gets offset and slide 1 lands partially
  // off-screen. The stitched-mode re-center effect re-runs on the
  // way back so returning is also clean.
  useEffect(() => {
    if (viewMode !== 'carousel') return
    setUserZoom(null)
    editor.setCurrentSlide(0)
    const el = wrapRef.current
    if (el) {
      el.scrollLeft = 0
      el.scrollTop = 0
    }
  }, [viewMode])

  const scale = viewMode === 'carousel' ? autoScale : (userZoom ?? autoScale)
  // Ref mirror of scale updated every render. Event listeners
  // attached via useEffect close over the outer `scale` when they
  // mount — any later scale change (autoScale recompute, userZoom
  // update) doesn't reach them through that closure. Reading
  // scaleRef.current inside handlers always sees the live value.
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  // Carousel: translate the strip so slide `currentSlide` sits in the
  // viewport center. The strip is centered by the outer
  // `translate(-50%, -50%)`, so our translateX is an offset from the
  // strip's own midpoint to slide i's midpoint. For N slides, the
  // correct offset is (N - 1 - 2i) * CANVAS.W / 2 — positive shifts
  // right, meaning slide 0 needs +((N-1)/2)*W to come into view.
  const n = post.slides.length
  const stripTranslate =
    viewMode === 'carousel'
      ? ((n - 1 - 2 * currentSlide) * CANVAS.W) / 2
      : 0

  // Stitched mode: shift+wheel zooms. Plain wheel/trackpad pans
  // freely in both axes via the native scroll container — there's
  // padding on all sides of the strip so you can roam far past the
  // artboard edges.
  useEffect(() => {
    const el = wrapRef.current
    if (!el || viewMode !== 'strip') return
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault()
        const base = scaleRef.current
        const factor = e.deltaY < 0 ? 1.04 : 1 / 1.04
        const next = Math.max(0.05, Math.min(3, base * factor))
        // Capture the content-space coord currently under the cursor.
        // The useLayoutEffect on userZoom/autoScale re-derives the
        // scroll position so this content point stays under the
        // cursor at the new scale — synchronous with paint, no
        // flicker (rAF caused a one-frame mismatch).
        const rect = el.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top
        const contentX = (el.scrollLeft + cx - PAD) / base
        const contentY = (el.scrollTop + cy - PAD) / base
        pendingZoomAnchorRef.current = { cx, cy, contentX, contentY }
        setUserZoom(next)
      }
      // Otherwise: let the browser handle both axes natively.
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [viewMode, autoScale, userZoom])

  // Carousel mode: horizontal trackpad/wheel → the strip follows the
  // finger in real time (no transition). When the gesture stops, snap
  // to whichever slide is closest to the current drag offset, with a
  // smooth CSS transition back. Shift+wheel kicks back to stitched.
  const [dragOffsetX, setDragOffsetX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  // Wait one frame after entering carousel mode before enabling the
  // transform transition — otherwise the strip animates from wherever
  // it was in stitched mode to the centered carousel position, which
  // looks like a stray animation when you just clicked the toggle.
  const [carouselReady, setCarouselReady] = useState(false)
  useEffect(() => {
    if (viewMode !== 'carousel') {
      setCarouselReady(false)
      return
    }
    const raf = requestAnimationFrame(() => setCarouselReady(true))
    return () => cancelAnimationFrame(raf)
  }, [viewMode])
  // Track the live offset in a ref alongside state — the ref is what
  // the snap-on-stop timer reads so we never work with stale closure
  // values or fight React's state updater semantics.
  const dragOffsetRef = useRef(0)
  const dragStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const el = wrapRef.current
    if (!el || viewMode !== 'carousel') return
    // Read currentSlide LIVE from the store inside any handler that
    // needs it — never from this effect's closure. Otherwise a snap
    // that was queued before a slide change happened uses the stale
    // "old slide" when it fires, off-by-one-ing the next step.
    const currentFromStore = () => editor.state.currentSlide
    const snap = () => {
      const live = currentFromStore()
      const finalOffset = dragOffsetRef.current
      const rel = -finalOffset / CANVAS.W
      // Math.round uses a 50% cutoff — a drag has to cross half the
      // slide to commit to the next one. Anything shy of that springs
      // back. Prevents small fast swipes from over-committing.
      const stepSlides = Math.round(rel)
      const nextSlide = Math.max(
        0,
        Math.min(post.slides.length - 1, live + stepSlides),
      )
      if (nextSlide !== live) editor.setCurrentSlide(nextSlide)
      dragOffsetRef.current = 0
      setDragOffsetX(0)
      setIsDragging(false)
    }
    const onWheel = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault()
        const factor = e.deltaY < 0 ? 1.04 : 1 / 1.04
        // Read scale LIVE, not from the stale closure captured when
        // this effect mounted.
        const base = scaleRef.current
        const next = Math.max(0.05, Math.min(3, base * factor))
        preserveCenterForSlideRef.current = currentFromStore()
        setUserZoom(next)
        editor.setViewMode('strip')
        return
      }
      // Use horizontal delta only. Mouse-wheel users with vertical-
      // only input don't accidentally swipe slides.
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0
      if (dx === 0) return
      e.preventDefault()
      // No snap lock. With a 50% commit threshold, trailing momentum
      // after a snap can't accumulate enough to commit to another
      // slide — it just wiggles briefly and the silence timer snaps
      // it back. This means the user's next intentional scroll is
      // immediately live, without waiting for a lock to release.

      // Strip translates LEFT when deltaX is positive, clamped so the
      // strip can't drag past the first or last slide. Clamp bounds
      // read from the live store so they stay correct across a snap
      // that happens mid-gesture.
      const live = currentFromStore()
      const minOffset = -(post.slides.length - 1 - live) * CANVAS.W
      const maxOffset = live * CANVAS.W
      const next = Math.max(minOffset, Math.min(maxOffset, dragOffsetRef.current - dx))
      dragOffsetRef.current = next
      setDragOffsetX(next)
      setIsDragging(true)

      // Single rule: snap ONLY after the user has stopped scrolling
      // for the silence window. Any new event clears the pending
      // pull, so a pre-snap nudge-to-scroll-again feels instant. If
      // they truly stop, the timer fires and commits.
      if (dragStopTimer.current) clearTimeout(dragStopTimer.current)
      dragStopTimer.current = setTimeout(() => {
        snap()
      }, 110)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (dragStopTimer.current) clearTimeout(dragStopTimer.current)
    }
    // currentSlide deliberately NOT in deps — we read it live from
    // the store. Re-attaching the listener on every slide change
    // caused stale-closure bugs where a snap queued pre-update used
    // the old slide index.
  }, [viewMode, post.slides.length])
  // Any slide change from outside (arrows, dots, carousel entry) also
  // resets the offset so the transform math stays consistent.
  useEffect(() => {
    dragOffsetRef.current = 0
    setDragOffsetX(0)
  }, [currentSlide])

  // Width/height of the rendered strip (post-scale). We surround it
  // with generous breathing room on every side so pan feels free.
  const renderedW = CANVAS.W * post.slides.length * scale
  const renderedH = CANVAS.H * scale
  // Each side of breathing room = one viewport-height/width roughly,
  // so the user can always drag layers past the artboard.
  const PAD = 400

  // Center the first slide in the viewport on mount and whenever the
  // post structure or auto-fit scale changes (viewport resize, slide
  // count change). Deliberately NOT keyed on `scale`/`userZoom` —
  // otherwise manual zoom would re-center on every wheel tick and
  // look animated. Manual zoom keeps the current scroll position.
  // Signals that the user explicitly clicked the Stitched toggle
  // (not the zoom-out gesture, not a post load). The re-center effect
  // runs ONLY when this is true OR it's the first mount. Everything
  // else — viewport resize, manual scroll — leaves the user alone.
  const explicitStitchClickRef = useRef(false)
  const hasCenteredOnceRef = useRef(false)
  // Set by the zoom-out-of-carousel handler with the slide index that
  // was visible at the moment of switch. The layout effect reads this
  // once and adjusts scrollLeft/Top so that slide stays centered at
  // the preserved scale — prevents the "jump to top-left" we see on
  // mode flip because carousel uses center-transform and strip uses
  // top-left scroll positioning.
  const preserveCenterForSlideRef = useRef<number | null>(null)
  // Set by the stitched-mode zoom handler with the cursor anchor in
  // both viewport pixels (cx, cy) and content units (contentX,
  // contentY). A useLayoutEffect re-derives scrollLeft/Top after
  // userZoom updates so the same content point stays under the
  // cursor — synchronous with paint, no flicker.
  const pendingZoomAnchorRef = useRef<
    | { cx: number; cy: number; contentX: number; contentY: number }
    | null
  >(null)
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el || viewMode !== 'strip') return

    // Path 0: zoom-to-cursor. Re-derive scroll so the content point
    // captured by the wheel handler stays under the same viewport
    // pixel at the new scale.
    if (pendingZoomAnchorRef.current) {
      const { cx, cy, contentX, contentY } = pendingZoomAnchorRef.current
      pendingZoomAnchorRef.current = null
      const eff = userZoom ?? autoScale
      el.scrollLeft = Math.max(0, contentX * eff + PAD - cx)
      el.scrollTop = Math.max(0, contentY * eff + PAD - cy)
      hasCenteredOnceRef.current = true
      return
    }

    // Path 1: zoom-out-of-carousel. Scroll so the slide the user was
    // viewing stays centered at the current (preserved) scale.
    if (preserveCenterForSlideRef.current != null) {
      const targetSlide = preserveCenterForSlideRef.current
      preserveCenterForSlideRef.current = null
      const effective = userZoom ?? autoScale
      const viewW = el.clientWidth
      const viewH = el.clientHeight
      const slideW = CANVAS.W * effective
      const slideH = CANVAS.H * effective
      const slideLeft = PAD + targetSlide * CANVAS.W * effective
      const wantedLeft = Math.max(0, slideLeft - (viewW - slideW) / 2)
      const wantedTop = Math.max(0, PAD - (viewH - slideH) / 2)
      el.scrollLeft = wantedLeft
      el.scrollTop = wantedTop
      hasCenteredOnceRef.current = true
      return
    }

    // Path 2: explicit Stitched button or first mount — fit + center
    // on slide 0.
    const shouldRecenter = explicitStitchClickRef.current || !hasCenteredOnceRef.current
    if (!shouldRecenter) return
    explicitStitchClickRef.current = false
    hasCenteredOnceRef.current = true
    const viewW = el.clientWidth
    const viewH = el.clientHeight
    const slideW = CANVAS.W * autoScale
    const slideH = CANVAS.H * autoScale
    el.scrollLeft = Math.max(0, PAD - (viewW - slideW) / 2)
    el.scrollTop = Math.max(0, PAD - (viewH - slideH) / 2)
  }, [autoScale, userZoom, viewMode, post.slides.length])

  return (
    <div
      className="relative flex-1 min-w-0"
      style={{ background: 'transparent' }}
    >
      <div
        ref={wrapRef}
        className="absolute inset-0 select-none nw-no-scrollbar"
        style={{
          overflow: viewMode === 'strip' ? 'auto' : 'hidden',
          cursor: panActive ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) return
          editor.select(null)
          // Drag-pan: if the user presses on the empty canvas area,
          // let them drag to scroll in any direction. Ignored when
          // they click on a layer (that event doesn't bubble here).
          if (viewMode !== 'strip') return
          const el = wrapRef.current
          if (!el) return
          setPanActive(true)
          const startX = e.clientX
          const startY = e.clientY
          const startLeft = el.scrollLeft
          const startTop = el.scrollTop
          const move = (ev: MouseEvent) => {
            el.scrollLeft = startLeft - (ev.clientX - startX)
            el.scrollTop = startTop - (ev.clientY - startY)
          }
          const up = () => {
            setPanActive(false)
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseup', up)
          }
          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        }}
      >
      <div
        className="relative"
        style={
          viewMode === 'carousel'
            ? {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: CANVAS.W * post.slides.length,
                height: CANVAS.H,
                transform: `translate(-50%, -50%) scale(${scale}) translateX(${stripTranslate + dragOffsetX}px)`,
                transformOrigin: 'center center',
                transition:
                  isDragging || !carouselReady
                    ? 'none'
                    : 'transform 280ms cubic-bezier(0.25,1,0.5,1)',
                willChange: 'transform',
              }
            : {
                // Total scrollable content = strip + breathing room on
                // every side so pan is free in both axes.
                width: renderedW + PAD * 2,
                height: renderedH + PAD * 2,
              }
        }
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) editor.select(null)
        }}
      >
        {/* In stitched mode the strip is positioned inside the padded
            content area and scaled to `scale`. The padding is what
            gives the user room to pan past the artboard edges. */}
        <div
          style={
            viewMode === 'strip'
              ? {
                  position: 'absolute',
                  top: PAD,
                  left: PAD,
                  width: CANVAS.W * post.slides.length,
                  height: CANVAS.H,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }
              : { position: 'absolute', inset: 0 }
          }
        >
        {post.slides.map((slide, i) => (
          <SlideFrame
            key={slide.id}
            slideIndex={i}
            background={slide.background}
            theme={post.theme}
            isLast={i === post.slides.length - 1}
          />
        ))}

        {/* Layers are rendered on top of slide frames so they can span
            across multiple slides. Each layer is absolutely positioned
            relative to the whole strip (slideIndex * CANVAS.W + x). */}
        {post.layers.map((layer) => (
          <LayerWrapper
            key={layer.id}
            layer={layer}
            selected={selectedLayerId === layer.id}
            scale={scale}
            theme={post.theme}
          />
        ))}
        </div>
      </div>

      {/* Carousel arrows */}
      {viewMode === 'carousel' && post.slides.length > 1 && (
        <>
          <ArrowButton
            side="left"
            disabled={currentSlide === 0}
            onClick={() => editor.setCurrentSlide(currentSlide - 1)}
          />
          <ArrowButton
            side="right"
            disabled={currentSlide === post.slides.length - 1}
            onClick={() => editor.setCurrentSlide(currentSlide + 1)}
          />
          {/* White pill behind the dots so they stay visible on dark
              slides. Matches the admin floating-toggle shape used by
              Stitched/Carousel above. */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(15,18,17,0.08)',
              boxShadow: '0 2px 8px rgba(15,18,17,0.06)',
              padding: '8px 12px',
            }}
          >
            {post.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => editor.setCurrentSlide(i)}
                className="h-2 rounded-full transition-all"
                style={{
                  background:
                    i === currentSlide
                      ? 'rgba(15,18,17,0.8)'
                      : 'rgba(15,18,17,0.2)',
                  width: i === currentSlide ? 20 : 8,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
      </div>

      {/* Floating view-mode toggle — sits as a sibling to the scroll
          container so it stays pinned in the viewport regardless of
          scroll/zoom inside the canvas. */}
      <div
        className="absolute top-4 left-1/2 z-30 pointer-events-none"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div
          className="relative flex items-center rounded-full pointer-events-auto"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.08)',
            padding: 4,
            height: 44,
            boxShadow: '0 2px 8px rgba(15,18,17,0.06)',
          }}
        >
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 4,
              bottom: 4,
              left: viewMode === 'strip' ? 4 : 'calc(50% + 0px)',
              width: 'calc(50% - 4px)',
              background: 'rgba(15,18,17,0.08)',
              border: '1px solid rgba(15,18,17,0.18)',
              transition: 'left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <button
            type="button"
            onClick={() => {
              // Explicit click → fit zoom + re-center.
              setUserZoom(null)
              explicitStitchClickRef.current = true
              editor.setViewMode('strip')
            }}
            className="relative z-10 text-sm rounded-full px-4"
            style={{
              color: viewMode === 'strip' ? '#0F1211' : 'rgba(15,18,17,0.55)',
              fontWeight: viewMode === 'strip' ? 500 : 400,
              height: '100%',
              minWidth: 100,
            }}
          >
            Stitched
          </button>
          <button
            type="button"
            onClick={() => editor.setViewMode('carousel')}
            className="relative z-10 text-sm rounded-full px-4"
            style={{
              color: viewMode === 'carousel' ? '#0F1211' : 'rgba(15,18,17,0.55)',
              fontWeight: viewMode === 'carousel' ? 500 : 400,
              height: '100%',
              minWidth: 100,
            }}
          >
            Carousel
          </button>
        </div>
      </div>

      {/* Floating zoom-reset badge (only when the user has manually
          zoomed). Save / Export live in the right panel footer. */}
      {viewMode === 'strip' && userZoom !== null && (
        <button
          onClick={() => setUserZoom(null)}
          className="absolute top-4 right-4 z-30 px-3 text-[11px] font-medium rounded-full transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
            height: 36,
          }}
          title="Reset zoom to fit"
        >
          {Math.round((userZoom / autoScale) * 100)}% · reset
        </button>
      )}
    </div>
  )
}

function SlideFrame({
  slideIndex,
  background,
  theme,
  isLast,
}: {
  slideIndex: number
  background?: string
  theme: 'dark' | 'light'
  isLast: boolean
}) {
  const { W, H } = CANVAS
  return (
    <div
      data-slide={slideIndex}
      className="absolute top-0 overflow-hidden"
      style={{
        left: slideIndex * W + slideIndex * STRIP_GAP,
        width: W,
        height: H,
        boxShadow: '0 1px 0 rgba(15,18,17,0.04)',
        borderRight: isLast ? 'none' : '1px dashed rgba(15,18,17,0.12)',
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) editor.select(null)
      }}
    >
      <SlideBackground theme={theme} background={background} />
    </div>
  )
}

function LayerWrapper({
  layer,
  selected,
  scale,
  theme,
}: {
  layer: Layer
  selected: boolean
  scale: number
  theme: 'dark' | 'light'
}) {
  // Compute the absolute position of the layer inside the strip.
  // slideIndex * CANVAS.W is the left edge of the layer's origin slide.
  const originLeft = layer.slideIndex * CANVAS.W + layer.x
  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: originLeft,
    top: layer.y,
    width: layer.w,
    height: layer.h,
    zIndex: layer.z ?? 0,
  }

  // Code layers use real x/y/w/h/spans like other layers, but sizing
  // happens via the inspector / MCP — Claude owns layout. The canvas
  // deliberately skips drag + resize handles so you can't nudge a
  // component out of place by accident.
  const isCodeLayer = layer.kind === 'code'

  const onMouseDown = (e: React.MouseEvent) => {
    if (layer.locked) return
    e.stopPropagation()
    editor.select(layer.id)
    if (!isCodeLayer) startDrag(e, layer, scale)
  }

  return (
    <div style={wrapperStyle} onMouseDown={onMouseDown}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Render with the layer positioned at 0,0 inside the wrapper
            — we already translated via wrapperStyle. */}
        <LayerNode
          layer={{ ...layer, x: 0, y: 0, slideIndex: 0 }}
          theme={theme}
        />
      </div>

      {/* Selection chrome */}
      {selected && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              outline: '2px solid #0A80FE',
              outlineOffset: 0,
            }}
          />
          {!isCodeLayer && <ResizeHandles layer={layer} scale={scale} />}
        </>
      )}
    </div>
  )
}

function ResizeHandles({ layer, scale }: { layer: Layer; scale: number }) {
  type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
  const handles: { key: Handle; style: React.CSSProperties }[] = [
    { key: 'nw', style: { top: -5, left: -5, cursor: 'nwse-resize' } },
    { key: 'n', style: { top: -5, left: '50%', marginLeft: -5, cursor: 'ns-resize' } },
    { key: 'ne', style: { top: -5, right: -5, cursor: 'nesw-resize' } },
    { key: 'e', style: { top: '50%', right: -5, marginTop: -5, cursor: 'ew-resize' } },
    { key: 'se', style: { bottom: -5, right: -5, cursor: 'nwse-resize' } },
    { key: 's', style: { bottom: -5, left: '50%', marginLeft: -5, cursor: 'ns-resize' } },
    { key: 'sw', style: { bottom: -5, left: -5, cursor: 'nesw-resize' } },
    { key: 'w', style: { top: '50%', left: -5, marginTop: -5, cursor: 'ew-resize' } },
  ]
  return (
    <>
      {handles.map((h) => (
        <div
          key={h.key}
          className="absolute z-10"
          style={{
            width: 10,
            height: 10,
            background: '#FFFFFF',
            border: '1.5px solid #0A80FE',
            borderRadius: 2,
            ...h.style,
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            startResize(e, layer, h.key, scale)
          }}
        />
      ))}
    </>
  )
}

// ─── Drag/resize logic ──────────────────────────────────────────────

// Shift-snap threshold in canvas units. If the layer's center is
// within this many units of its slide center on either axis, the
// layer snaps to center on that axis.
const SNAP_THRESHOLD = 80

function startDrag(e: React.MouseEvent, layer: Layer, scale: number) {
  const startX = e.clientX
  const startY = e.clientY
  const { x, y, w, h } = layer
  const slideCenterX = layer.slideIndex * CANVAS.W + CANVAS.W / 2
  const slideCenterY = CANVAS.H / 2
  const move = (ev: MouseEvent) => {
    const dx = (ev.clientX - startX) / scale
    const dy = (ev.clientY - startY) / scale
    let nextX = Math.round(x + dx)
    let nextY = Math.round(y + dy)
    if (ev.shiftKey) {
      // Compute the layer's would-be center (x is relative to its
      // origin slide, so strip the slide offset before comparing).
      const centerX = layer.slideIndex * CANVAS.W + nextX + w / 2
      const centerY = nextY + h / 2
      if (Math.abs(centerX - slideCenterX) < SNAP_THRESHOLD) {
        nextX = Math.round((CANVAS.W - w) / 2)
      }
      if (Math.abs(centerY - slideCenterY) < SNAP_THRESHOLD) {
        nextY = Math.round((CANVAS.H - h) / 2)
      }
    }
    editor.updateLayer(layer.id, { x: nextX, y: nextY })
  }
  const up = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function startResize(
  e: React.MouseEvent,
  layer: Layer,
  handle: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w',
  scale: number,
) {
  const startX = e.clientX
  const startY = e.clientY
  const { x, y, w, h } = layer
  const isCorner = handle.length === 2
  // Lock aspect by default on image / shape / gradient / icon when
  // dragging a corner — those layers are usually meant to keep their
  // ratio. Text resizes freely so you can control line wrap. Holding
  // Shift toggles the opposite behaviour (lock ↔ free).
  const ratioEligible =
    layer.kind === 'image' ||
    layer.kind === 'icon' ||
    layer.kind === 'shape' ||
    layer.kind === 'gradient'
  const ratio = h === 0 ? 1 : w / h
  const move = (ev: MouseEvent) => {
    const dx = (ev.clientX - startX) / scale
    const dy = (ev.clientY - startY) / scale
    const lockAspect =
      isCorner && ratioEligible && (ev.shiftKey ? false : true)
    let nx = x
    let ny = y
    let nw = w
    let nh = h
    if (lockAspect) {
      // Drive sizing from the larger dominant axis so the motion feels
      // natural. `signX`/`signY` turn the handle direction into +/-1.
      const signX = handle.includes('e') ? 1 : handle.includes('w') ? -1 : 0
      const signY = handle.includes('s') ? 1 : handle.includes('n') ? -1 : 0
      const cand1 = w + signX * dx
      const cand2 = (h + signY * dy) * ratio
      const useW = Math.abs(cand1 - w) > Math.abs(cand2 - w) ? cand1 : cand2
      nw = Math.max(8, useW)
      nh = Math.max(8, nw / ratio)
      if (handle.includes('w')) nx = x + (w - nw)
      if (handle.includes('n')) ny = y + (h - nh)
    } else {
      if (handle.includes('e')) nw = Math.max(8, w + dx)
      if (handle.includes('s')) nh = Math.max(8, h + dy)
      if (handle.includes('w')) {
        nw = Math.max(8, w - dx)
        nx = x + (w - nw)
      }
      if (handle.includes('n')) {
        nh = Math.max(8, h - dy)
        ny = y + (h - nh)
      }
    }
    editor.updateLayer(layer.id, {
      x: Math.round(nx),
      y: Math.round(ny),
      w: Math.round(nw),
      h: Math.round(nh),
    })
  }
  const up = () => {
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function ArrowButton({
  side,
  disabled,
  onClick,
}: {
  side: 'left' | 'right'
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Previous slide' : 'Next slide'}
      className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all disabled:opacity-30"
      style={{
        [side]: 16,
        width: 44,
        height: 44,
        background: '#FFFFFF',
        border: '1px solid rgba(15,18,17,0.1)',
        boxShadow: '0 2px 8px rgba(15,18,17,0.06)',
        color: '#0F1211',
      } as React.CSSProperties}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {side === 'left' ? (
          <path d="m15 18-6-6 6-6" />
        ) : (
          <path d="m9 18 6-6-6-6" />
        )}
      </svg>
    </button>
  )
}
