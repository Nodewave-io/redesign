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
    // Always fetch the full list — filter client-side. The Supabase
    // shim's `.contains()` is a no-op so server-side category filtering
    // never worked anyway, and the asset count is small enough (a few
    // dozen) that loading once and slicing in JS is faster than any
    // round-trip would be.
    const { data } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
    setAssets((data as MediaAsset[]) ?? [])
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const onInsert = (asset: MediaAsset) => {
    const slideIndex = 0
    if (asset.kind === 'component') {
      // Drop the component at its saved native dimensions (matches
      // the size of the layer it was authored from). Centered on the
      // slide so the user can see it immediately. Falls back to the
      // full canvas for older assets that pre-date the native-dim
      // save flow.
      const w = asset.width && asset.width > 0 ? asset.width : CANVAS.W
      const h = asset.height && asset.height > 0 ? asset.height : CANVAS.H
      editor.addLayer({
        kind: 'code',
        slideIndex,
        x: Math.round((CANVAS.W - w) / 2),
        y: Math.round((CANVAS.H - h) / 2),
        w,
        h,
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
  // Filter pipeline: category first (if not "all"), then text search.
  const shown = assets
    .filter((a) =>
      category === 'all' ? true : (a.categories ?? []).includes(category),
    )
    .filter((a) =>
      !q
        ? true
        : a.name.toLowerCase().includes(q) ||
          (a.description ?? '').toLowerCase().includes(q) ||
          (a.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    )

  // Build the dropdown from categories actually in use, ranked by
  // count. Falls back to SUGGESTED_CATEGORIES for the empty-library
  // case so the user sees what's possible. Same approach the
  // /assets page uses (consistent UX between the two filters).
  const categoryOptions = (() => {
    const counts = new Map<string, number>()
    for (const a of assets) {
      for (const c of a.categories ?? []) {
        counts.set(c, (counts.get(c) ?? 0) + 1)
      }
    }
    if (counts.size === 0) {
      return SUGGESTED_CATEGORIES.map((c) => [c, 0] as [string, number])
    }
    return Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )
  })()

  return (
    <div className="flex flex-col h-full">
      <div className="pb-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 text-sm rounded-full outline-none transition-colors"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid rgba(24,18,15,0.12)',
            color: 'var(--nw-admin-fg)',
            height: 44,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nw-admin-accent)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(24,18,15,0.12)' }}
        >
          <option value="all">All categories</option>
          {categoryOptions.map(([name, count]) => (
            <option key={name} value={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
              {count > 0 ? ` (${count})` : ''}
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
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid rgba(24,18,15,0.12)',
            color: 'var(--nw-admin-fg)',
            height: 44,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nw-admin-accent)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(24,18,15,0.12)' }}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-3">
        {loading ? (
          <p className="text-xs" style={{ color: 'rgba(24,18,15,0.4)' }}>Loading…</p>
        ) : shown.length === 0 ? (
          <p className="text-xs" style={{ color: 'rgba(24,18,15,0.4)' }}>
            No matches. Manage the library in{' '}
            <Link href="/assets" className="underline">
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
                    'repeating-conic-gradient(rgba(24,18,15,0.04) 0% 25%, transparent 0% 50%) 50% / 12px 12px',
                  border: '1px solid rgba(24,18,15,0.08)',
                }}
                title={a.description || a.name}
              >
                {a.kind === 'component' ? (
                  <ScaledComponent source={a.source_code ?? ''} nativeW={a.width} nativeH={a.height} />
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
          href="/assets"
          className="flex items-center justify-center gap-2 w-full text-sm rounded-full transition-colors"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid rgba(24,18,15,0.12)',
            color: 'var(--nw-admin-fg)',
            height: 44,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(24,18,15,0.03)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--nw-admin-surface-inner)' }}
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
function ScaledComponent({
  source,
  nativeW,
  nativeH,
}: {
  source: string
  nativeW?: number | null
  nativeH?: number | null
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const W = nativeW && nativeW > 0 ? nativeW : CANVAS.W
  const H = nativeH && nativeH > 0 ? nativeH : CANVAS.H

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      const ratioW = el.clientWidth / W
      const ratioH = el.clientHeight / H
      const MARGIN = 0.86
      setScale(Math.min(ratioW, ratioH) * MARGIN)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [W, H])

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      // Auto-pick a backdrop matching the component's design tone
      // (light components → cream, otherwise dark). Same heuristic
      // the /assets page uses, kept inline because LeftPanel is
      // imported into the editor before the assets page mounts.
      style={{ background: pickPanelBg(source) }}
    >
      {scale > 0 && (
        <div
          style={{
            width: W,
            height: H,
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

function pickPanelBg(source: string): string {
  const m = source.match(/background\s*:\s*['"]?([^,'"}]+)/)
  if (!m) return '#0A0A0A'
  const v = m[1].toLowerCase()
  const isLight =
    v.includes('#fff') ||
    v.includes('#f5efe6') ||
    v.includes('rgba(255') ||
    v.includes('rgb(255')
  return isLight ? '#F5EFE6' : '#0A0A0A'
}
