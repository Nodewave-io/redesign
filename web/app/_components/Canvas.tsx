'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { editor, useEditorState } from '../_lib/store'
import { CANVAS, themeColors } from '../_lib/types'
import type { Layer } from '../_lib/types'
import { LayerNode, SlideBackground } from '../_lib/render'

const STRIP_GAP = 0 // IG-style continuous roll — slides touch
// Hard floor on manual zoom-out. Anything past this gets unreadable
// AND keeps the dot-grid scaling so it feels like the canvas keeps
// shrinking even though the user can't make sense of what they see.
// Reset is always one click away to return to a usable scale.
const MIN_ZOOM = 0.10

// Viewport real-estate consumed by the floating panels at md+ widths
// (the AdminSidebar at left and the RightPanel at right both use
// `hidden md:flex`). Below md the panels stack/hide so the canvas
// gets the full viewport. Used by the centering + fit-all math so
// the visible strip looks centered between the two panels, not
// between the raw viewport edges.
const LEFT_PANEL_W = 220   // AdminSidebar: fixed, width 220
const RIGHT_PANEL_W = 296  // RightPanel: right:16 + width:280
const MD_BREAKPOINT = 768

function panelMass(): { left: number; right: number } {
  if (typeof window === 'undefined') return { left: 0, right: 0 }
  if (!window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`).matches) {
    return { left: 0, right: 0 }
  }
  return { left: LEFT_PANEL_W, right: RIGHT_PANEL_W }
}

// Scroll writes inside the same effect that calls setAutoScale (or
// setUserZoom) get clamped to the inner div's pre-state-update width.
// Defer to a microtask after React commits, then retry across a few
// animation frames in case the inner div takes additional commits to
// resize. Calls onApplied once the scroll position sticks.
function scheduleScrollApply(
  el: HTMLElement,
  targetLeft: number,
  targetTop: number,
  onApplied?: () => void,
): void {
  const tryApply = (frames: number) => {
    el.scrollLeft = targetLeft
    el.scrollTop = targetTop
    const stuck =
      Math.abs(el.scrollLeft - targetLeft) > 1 ||
      Math.abs(el.scrollTop - targetTop) > 1
    if (stuck && frames > 0) {
      requestAnimationFrame(() => tryApply(frames - 1))
    } else if (onApplied) {
      onApplied()
    }
  }
  setTimeout(() => tryApply(10), 0)
}

export function Canvas() {
  const { post, selectedLayerId, viewMode, currentSlide } = useEditorState()
  const colors = themeColors(post.theme)

  // Two modes:
  //  • carousel — auto-fit a single slide, no scroll, no manual zoom.
  //  • stitched — user can pan horizontally and shift+wheel to zoom.
  // `autoScale` is the fit-to-viewport scale (recomputed on resize).
  // `userZoom` overrides it once the user has zoomed manually.
  const wrapRef = useRef<HTMLDivElement | null>(null)
  // 0 means "not measured yet". The layout-effect re-center skips
  // until autoScale is a real measured value, so first paint doesn't
  // run with the default and lock in a stale scroll position.
  const [autoScale, setAutoScale] = useState(0)
  const [userZoom, setUserZoom] = useState<number | null>(null)
  const [panActive, setPanActive] = useState(false)
  // Bumped whenever we want the layout effect to re-run regardless of
  // whether viewMode/autoScale/length actually changed. Stitched-click
  // increments it so even a same-mode click triggers a re-center.
  const [recenterTick, setRecenterTick] = useState(0)
  // Live wrap viewport dimensions, kept in sync by the autoScale
  // effect. Read in render to position the strip dynamically when it
  // fits within the visible band (small post = no scroll needed,
  // strip gets pinned at the visible-area center).
  const [wrapDims, setWrapDims] = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      // Bail before we have a real measurement — running on a 0×0
      // wrap would compute s=0 and lock the scroll position with
      // stripW=0. The ResizeObserver will call us again once the wrap
      // is laid out.
      if (rect.width === 0 || rect.height === 0) return
      // Keep wrap dims in render-readable state so the JSX strip
      // positioning can reference them.
      setWrapDims({ w: rect.width, h: rect.height })
      const visiblePages = viewMode === 'carousel' ? 1 : post.slides.length
      const totalCanvasW =
        CANVAS.W * visiblePages + STRIP_GAP * Math.max(0, visiblePages - 1)
      // Subtract the floating panels' footprint so the fit-all math
      // sizes the strip to what the user can ACTUALLY see between the
      // two side panels (not edge-to-edge of the viewport, where it
      // would slide partially under a panel). On narrow screens panels
      // hide so panelMass() returns 0 and we use the full width.
      const panels = panelMass()
      const visibleW = rect.width - panels.left - panels.right
      const availW = visibleW - 48
      // Same vertical reserve for both modes so a 1-slide post in
      // Stitched and the same post in Carousel render at IDENTICAL
      // scale and position. The toggle pill (top) and pagination dots
      // (bottom) overlay the slide instead of pushing it down — Tiago
      // wants visual parity between the two views.
      const availH = rect.height - 48
      // 0.75 = strip takes ~60% of the visible (panel-excluded)
      // viewport, leaving ~20% margin on each side. Tuned for the
      // "fit-all overview" feel: you can see every slide AND have
      // room to drag/edit without the strip kissing panel edges.
      const FIT_MARGIN = 0.75
      const s = Math.max(
        0.05,
        Math.min(availW / totalCanvasW, availH / CANVAS.H) * FIT_MARGIN,
      )
      setAutoScale(s)

      // If a recenter is pending AND we're in stitched mode, apply it
      // RIGHT HERE using the freshly-measured `s`. The previous design
      // signaled the recenter via a separate useLayoutEffect, but
      // React commits the autoScale state update on its own render
      // pass — so the recenter effect would read the prior autoScale
      // and lock in a wrong scrollLeft. Doing both in one place
      // eliminates the cross-effect race entirely.
      if (
        viewMode === 'strip' &&
        (explicitStitchClickRef.current || !hasCenteredOnceRef.current)
      ) {
        explicitStitchClickRef.current = false
        const stripW = CANVAS.W * post.slides.length * s
        const stripH = CANVAS.H * s
        // Mirror the same `stripLeft`/`stripTop` choice the JSX makes
        // for this scale, so the effective scroll target reduces to
        // 0 when the strip is small enough to be anchored visually.
        const visibleCenterX = panels.left + (el.clientWidth - panels.left - panels.right) / 2
        const visibleCenterY = el.clientHeight / 2
        const stripLeftNow =
          stripW < el.clientWidth - panels.left - panels.right
            ? Math.max(PAD, visibleCenterX - stripW / 2)
            : PAD
        const stripTopNow =
          stripH < el.clientHeight
            ? Math.max(PAD, visibleCenterY - stripH / 2)
            : PAD
        const targetLeft = Math.max(0, stripLeftNow + stripW / 2 - visibleCenterX)
        const targetTop = Math.max(0, stripTopNow + stripH / 2 - visibleCenterY)
        scheduleScrollApply(el, targetLeft, targetTop, () => {
          hasCenteredOnceRef.current = true
        })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [viewMode, post.slides.length, recenterTick])

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
        const next = Math.max(MIN_ZOOM, Math.min(3, base * factor))
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
        const next = Math.max(MIN_ZOOM, Math.min(3, base * factor))
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

  // Carousel: ← / → navigate slides. Suppress when the user is
  // typing in an input/textarea/contenteditable so layer labels and
  // text fields aren't hijacked. Wraps current slide index against
  // the post boundary; no-op at the edges.
  useEffect(() => {
    if (viewMode !== 'carousel') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const t = document.activeElement
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        (t instanceof HTMLElement && t.isContentEditable)
      ) {
        return
      }
      e.preventDefault()
      const cur = editor.state.currentSlide
      if (e.key === 'ArrowLeft' && cur > 0) editor.setCurrentSlide(cur - 1)
      else if (e.key === 'ArrowRight' && cur < post.slides.length - 1) {
        editor.setCurrentSlide(cur + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewMode, post.slides.length])

  // Width/height of the rendered strip (post-scale). We surround it
  // with generous breathing room on every side so pan feels free.
  const renderedW = CANVAS.W * post.slides.length * scale
  const renderedH = CANVAS.H * scale
  // Each side of breathing room = one viewport-height/width roughly,
  // so the user can always drag layers past the artboard.
  const PAD = 400
  // When the rendered strip is smaller than the visible band between
  // panels, anchor its left/top so the visible center coincides with
  // the strip center at scrollLeft=0 (otherwise the math wants
  // negative scroll, which gets clamped, leaving the strip stuck to
  // the left/top of the viewport). Falls back to PAD when the strip
  // exceeds the visible band — scroll then handles centering.
  const _panels = panelMass()
  const _visibleW = wrapDims.w - _panels.left - _panels.right
  const _visibleCenterX = _panels.left + _visibleW / 2
  const _visibleCenterY = wrapDims.h / 2
  const stripLeft =
    wrapDims.w > 0 && renderedW < _visibleW
      ? Math.max(PAD, _visibleCenterX - renderedW / 2)
      : PAD
  const stripTop =
    wrapDims.h > 0 && renderedH < wrapDims.h
      ? Math.max(PAD, _visibleCenterY - renderedH / 2)
      : PAD

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

  // When the slide count changes (user added or removed slides) the
  // old scroll position is meaningless — autoScale recomputes for
  // the new total width, but scrollLeft still points at the old
  // geometry, leaving the strip visually off-center. Force a
  // re-center the next time the layout effect runs. Tracks previous
  // length so we only trigger on actual changes, not every render.
  const prevSlideCountRef = useRef(post.slides.length)
  useEffect(() => {
    if (prevSlideCountRef.current !== post.slides.length) {
      prevSlideCountRef.current = post.slides.length
      explicitStitchClickRef.current = true
      setUserZoom(null)
      setRecenterTick((t) => t + 1)
    }
  }, [post.slides.length])
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el || viewMode !== 'strip') return
    // Wait for the real autoScale measurement before centering;
    // running with the default value locks in a wrong scrollLeft
    // and the post-measure pass is then blocked by hasCenteredOnceRef.
    if (autoScale === 0) return

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

    // Path 2 (Stitched-click + first-mount centering) lives in the
    // autoScale measurement effect now — same place that owns the
    // freshly-measured scale, so there's no cross-effect race.
  }, [autoScale, userZoom, viewMode, post.slides.length, recenterTick])

  return (
    <div
      // Edge-to-edge canvas area. Overlays (sidebar + right panel)
      // float on top; slides can scroll under them. Dots paint on the
      // cream page bg and track the canvas transform below.
      className="absolute inset-0"
      style={{ background: 'var(--nw-admin-bg)' }}
    >
      <div
        ref={wrapRef}
        // Viewport of the canvas — no dots here. The dots live inside
        // the scaled world div below so they inherit the zoom + pan
        // of the content, which is what makes them feel anchored to
        // the canvas coordinate system (n8n / Miro behavior).
        className="absolute inset-0 select-none nw-no-scrollbar"
        style={{
          overflow: viewMode === 'strip' ? 'auto' : 'hidden',
          cursor: panActive ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => {
          // Layer wrappers stopPropagation, so anything reaching here
          // is a click on empty canvas — deselect + start pan. We
          // don't gate on `e.target === e.currentTarget` because the
          // padded inner content div fills the wrapper, so any click
          // on the empty pad area surrounding the slides bubbles up
          // with `e.target` set to that inner div, not the wrapper.
          editor.select(null)
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
                // Panel-aware horizontal anchor: the carousel midpoint
                // sits at the center of the visible band between the
                // sidebar and right panel (not the raw viewport
                // center). On md- screens panelMass() returns 0 and
                // this collapses back to 50%.
                left:
                  wrapDims.w > 0
                    ? `${_panels.left + (wrapDims.w - _panels.left - _panels.right) / 2}px`
                    : '50%',
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
                // every side so pan is free in both axes. We size off
                // stripLeft/stripTop (which expand when the strip is
                // small enough to be visually centered without scroll)
                // so the inner div is wide enough for the chosen
                // anchor position.
                width: stripLeft + renderedW + PAD,
                height: stripTop + renderedH + PAD,
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
                  top: stripTop,
                  left: stripLeft,
                  width: CANVAS.W * post.slides.length,
                  height: CANVAS.H,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  // Clip layers to the strip rect so the editor matches
                  // what export produces. The render route screenshots
                  // a single 1000×1250 #nw-slide-root with its own
                  // overflow:hidden, so any layer poking past the
                  // canvas just disappears in the PNG. Without this
                  // clip the editor showed phantom content that the
                  // user thought would ship — confusing.
                  overflow: 'hidden',
                }
              : { position: 'absolute', inset: 0, overflow: 'hidden' }
          }
        >
        {/* World-space dot grid — sibling of the slide strip, rendered
            first so it sits behind everything. The huge negative inset
            makes the pattern span far past the slide bounds so zoom-
            out / heavy pan still shows dots edge-to-edge. Inherits the
            parent's transform (scale in stitched mode, scale+translate
            in carousel mode), so dots zoom with the content and feel
            anchored to the canvas coordinate system. */}
        <div
          aria-hidden
          className="nw-admin-dots absolute pointer-events-none"
          style={{ inset: '-30000px' }}
        />
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

      </div>

      {/* Carousel arrows + dots — siblings of the wrap so their
          absolute positioning is relative to the outer
          viewport-pinned container, not the scroll container (whose
          scrollLeft would otherwise shift these chrome elements). */}
      {viewMode === 'carousel' && post.slides.length > 1 && (
        <>
          <ArrowButton
            side="left"
            disabled={currentSlide === 0}
            scale={scale}
            anchorX={_visibleCenterX}
            onClick={() => editor.setCurrentSlide(currentSlide - 1)}
          />
          <ArrowButton
            side="right"
            disabled={currentSlide === post.slides.length - 1}
            scale={scale}
            anchorX={_visibleCenterX}
            onClick={() => editor.setCurrentSlide(currentSlide + 1)}
          />
          <div
            className="absolute bottom-6 flex items-center gap-1.5 rounded-full"
            style={{
              left: wrapDims.w > 0 ? _visibleCenterX : '50%',
              transform: 'translateX(-50%)',
              background: 'var(--nw-admin-surface-inner)',
              border: '1px solid var(--nw-admin-surface-border)',
              boxShadow: '0 2px 8px rgba(24,18,15,0.06)',
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
                      ? 'var(--nw-admin-fg)'
                      : 'var(--nw-admin-muted-soft)',
                  width: i === currentSlide ? 20 : 8,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Floating view-mode toggle — sits as a sibling to the scroll
          container so it stays pinned in the viewport regardless of
          scroll/zoom inside the canvas. Anchored to the visible-band
          center so it sits above the slide, not above the panels. */}
      <div
        className="absolute top-4 z-30 pointer-events-none"
        style={{
          left: wrapDims.w > 0 ? _visibleCenterX : '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          className="relative flex items-center rounded-full pointer-events-auto"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid rgba(24,18,15,0.08)',
            padding: 4,
            height: 44,
            boxShadow: '0 2px 8px rgba(24,18,15,0.06)',
          }}
        >
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 4,
              bottom: 4,
              left: viewMode === 'strip' ? 4 : 'calc(50% + 0px)',
              width: 'calc(50% - 4px)',
              background: 'rgba(24,18,15,0.08)',
              border: '1px solid rgba(24,18,15,0.18)',
              transition: 'left 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <button
            type="button"
            onClick={() => {
              // Explicit click → fit zoom + re-center. Bump the tick
              // so the layout effect re-runs even when viewMode is
              // already 'strip' (clicking Overview while in Overview).
              setUserZoom(null)
              explicitStitchClickRef.current = true
              editor.setViewMode('strip')
              setRecenterTick((t) => t + 1)
            }}
            className="relative z-10 text-sm rounded-full px-4"
            style={{
              color: viewMode === 'strip' ? 'var(--nw-admin-fg)' : 'rgba(24,18,15,0.55)',
              fontWeight: viewMode === 'strip' ? 500 : 400,
              height: '100%',
              minWidth: 100,
            }}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => editor.setViewMode('carousel')}
            className="relative z-10 text-sm rounded-full px-4"
            style={{
              color: viewMode === 'carousel' ? 'var(--nw-admin-fg)' : 'rgba(24,18,15,0.55)',
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
          zoomed). Sits to the LEFT of the right panel so it doesn't
          overlap — right-panel is 280px wide with a 16px margin, so
          offset = 16 + 280 + 8 = 304px from the viewport's right edge. */}
      {viewMode === 'strip' && userZoom !== null && (
        <button
          onClick={() => {
            // Reset = same behavior as clicking the Stitched toggle
            // (fit all slides, centered both axes, with breathing
            // room around the strip). Both buttons should produce
            // the same view, otherwise there are two ways to "go
            // home" and they'd diverge.
            setUserZoom(null)
            explicitStitchClickRef.current = true
            setRecenterTick((t) => t + 1)
          }}
          className="fixed top-4 z-40 px-3 text-[11px] font-medium rounded-full transition-colors"
          style={{
            right: 304,
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-surface-border)',
            color: 'var(--nw-admin-surface-fg)',
            height: 36,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--nw-admin-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--nw-admin-surface-inner)' }}
          title="Reset zoom: fit current slide, stay in stitched"
        >
          {Math.round(userZoom * 100)}% · reset
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
        boxShadow: '0 1px 0 rgba(24,18,15,0.04)',
        borderRight: isLast ? 'none' : '1px dashed rgba(24,18,15,0.12)',
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
              outline: '2px solid var(--nw-admin-accent)',
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
            background: 'var(--nw-admin-surface-inner)',
            border: '1.5px solid var(--nw-admin-accent)',
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
  scale,
  anchorX,
  onClick,
}: {
  side: 'left' | 'right'
  disabled?: boolean
  // Current canvas scale — the slide width at render is CANVAS.W *
  // scale, so half of that is how far the slide edge sits from the
  // anchor center. We anchor the arrow just beyond that edge.
  scale: number
  // X coord (viewport pixels) the arrows orbit around. Matches the
  // slide's horizontal midpoint (panel-aware), not the raw viewport
  // center, so arrows stay flanking the slide regardless of which
  // panels are open.
  anchorX: number
  onClick: () => void
}) {
  const ARROW = 44
  const GAP = 16
  const halfSlide = (CANVAS.W * scale) / 2
  // Left arrow's right edge sits `GAP` left of the slide's left edge.
  // Right arrow's left edge sits `GAP` right of the slide's right edge.
  const offset = halfSlide + GAP
  const positional: React.CSSProperties =
    side === 'left'
      ? { left: anchorX - offset - ARROW }
      : { left: anchorX + offset }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Previous slide' : 'Next slide'}
      className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-colors"
      style={{
        ...positional,
        width: ARROW,
        height: ARROW,
        background: 'var(--nw-admin-surface-inner)',
        border: '1px solid var(--nw-admin-surface-border)',
        boxShadow: '0 2px 8px rgba(24,18,15,0.06)',
        // Orange arrow when clickable, muted ink when you can't scroll
        // further that direction — clear affordance without hiding
        // the button entirely.
        color: disabled ? 'var(--nw-admin-muted-soft)' : 'var(--nw-admin-accent)',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {side === 'left' ? (
          <path d="m15 18-6-6 6-6" />
        ) : (
          <path d="m9 18 6-6-6-6" />
        )}
      </svg>
    </button>
  )
}
