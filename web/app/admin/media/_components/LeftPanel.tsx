'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { editor } from '../_lib/store'
import { CANVAS, MediaAsset, SUGGESTED_CATEGORIES } from '../_lib/types'
import { CodeRunner } from '../_lib/code-runtime'

// Sidebar extension for the editor. Post switching happens at the
// /admin/media overview, so this panel is just the asset picker +
// "manage library" shortcut — no tabs, no Posts list.
export function LeftPanel(_props: { refreshKey?: number } = {}) {
  return (
    <div
      className="w-full rounded-3xl flex flex-col min-h-0"
      style={{
        background: 'var(--nw-admin-surface-outer)',
        border: '1px solid var(--nw-admin-border-outer)',
        padding: 10,
      }}
    >
      <div
        className="rounded-3xl flex flex-col min-h-0 flex-1"
        style={{
          background: 'var(--nw-admin-surface-inner)',
          border: '1px solid var(--nw-admin-border-inner)',
          padding: 12,
        }}
      >
        <AssetsPanel />
      </div>
    </div>
  )
}

// ─── Assets ──────────────────────────────────────────────────────────

function AssetsPanel() {
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const q = supabase.from('media_assets').select('*').order('created_at', { ascending: false })
    const { data } =
      category === 'all' ? await q : await q.contains('categories', [category])
    setAssets((data as MediaAsset[]) ?? [])
    setLoading(false)
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const onInsert = (asset: MediaAsset) => {
    const slideIndex = 0
    if (asset.kind === 'component') {
      // Library components are pre-designed for the full 1080×1350
      // frame, so we drop them in at canvas size. Claude can resize
      // later via MCP once the user asks to stack more on the slide.
      editor.addLayer({
        kind: 'code',
        slideIndex,
        x: 0,
        y: 0,
        w: CANVAS.W,
        h: CANVAS.H,
        source: asset.source_code ?? '<div style={{ color: "red" }}>Empty component</div>',
      })
      return
    }
    const ratio = asset.width && asset.height ? asset.width / asset.height : 1
    const targetW = 480
    const targetH = targetW / ratio
    const isIcon = asset.categories.includes('icons')
    const url = asset.file_url ?? ''
    if (isIcon) {
      editor.addLayer({
        kind: 'icon',
        slideIndex,
        x: (CANVAS.W - targetW) / 2,
        y: (CANVAS.H - targetH) / 2,
        w: targetW,
        h: targetH,
        url,
      })
    } else {
      editor.addLayer({
        kind: 'image',
        slideIndex,
        x: (CANVAS.W - targetW) / 2,
        y: (CANVAS.H - targetH) / 2,
        w: targetW,
        h: targetH,
        url,
        fit: 'cover',
      })
    }
  }

  const q = search.trim().toLowerCase()
  const shown = q
    ? assets.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.description ?? '').toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      )
    : assets

  return (
    <div className="flex flex-col h-full">
      <div className="pb-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 text-sm rounded-full outline-none transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
            height: 44,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0A80FE' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(15,18,17,0.12)' }}
        >
          <option value="all">All categories</option>
          {SUGGESTED_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="pb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full px-4 text-sm rounded-full outline-none transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
            height: 44,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#0A80FE' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(15,18,17,0.12)' }}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-3">
        {loading ? (
          <p className="text-xs" style={{ color: 'rgba(15,18,17,0.4)' }}>Loading…</p>
        ) : shown.length === 0 ? (
          <p className="text-xs" style={{ color: 'rgba(15,18,17,0.4)' }}>
            No matches. Manage the library in{' '}
            <Link href="/admin/media/assets" className="underline">
              Assets
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {shown.map((a) => (
              <button
                key={a.id}
                onClick={() => onInsert(a)}
                className="group relative aspect-square rounded-xl overflow-hidden transition-all"
                style={{
                  background:
                    'repeating-conic-gradient(rgba(15,18,17,0.04) 0% 25%, transparent 0% 50%) 50% / 12px 12px',
                  border: '1px solid rgba(15,18,17,0.08)',
                }}
                title={a.description || a.name}
              >
                {a.kind === 'component' ? (
                  <ScaledComponent source={a.source_code ?? ''} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.file_url ?? ''}
                    alt={a.name}
                    className="w-full h-full object-contain p-3"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Link to the dedicated catalog — the real source of truth. */}
      <div className="pt-1">
        <Link
          href="/admin/media/assets"
          className="flex items-center justify-center gap-2 w-full text-sm rounded-full transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
            height: 44,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,18,17,0.03)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF' }}
        >
          Manage library
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}


// Fits a component snippet into a small thumbnail. Snippets are
// designed for the full 1000×1250 canvas; at a 90×90 tile that's an
// 11× downscale. Same technique as the overview's FirstSlidePreview —
// render at native size, transform-scale to fit, overflow-hidden.
function ScaledComponent({ source }: { source: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const ratioW = el.clientWidth / CANVAS.W
      const ratioH = el.clientHeight / CANVAS.H
      // Use `min` here (not `max` like the full-slide preview) so the
      // whole component fits inside the square — we'd rather see
      // letterboxing than crop the edges off a chart.
      setScale(Math.min(ratioW, ratioH))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
    >
      {scale > 0 && (
        <div
          style={{
            width: CANVAS.W,
            height: CANVAS.H,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            flexShrink: 0,
          }}
        >
          <CodeRunner source={source} />
        </div>
      )}
    </div>
  )
}
