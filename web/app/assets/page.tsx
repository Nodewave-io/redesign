'use client'

// Full catalog of every asset in the library. The source of truth for
// the creative toolbox: upload, rename, retag, replace files, delete.
// The editor's left-panel picker only *inserts* — management happens
// here.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/sidebar'
import {
  AssetKind,
  CANVAS,
  MediaAsset,
  SUGGESTED_CATEGORIES,
  cryptoId,
} from '../_lib/types'
import { CodeRunner } from '../_lib/code-runtime'
import { FONTS_CHANGED_EVENT } from '../_components/user-fonts'

type UserFont = {
  family: string
  file: string
  format: 'truetype' | 'opentype' | 'woff' | 'woff2'
  mime: string
  size: number
}

// Special filter token. The "Fonts" pill in the dropdown sets this so
// the grid renders only the font cards. Anything else in `filter` is
// either 'all' or a real asset-category name.
const FONTS_FILTER = '__fonts__'

export default function AssetsCatalog() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [fonts, setFonts] = useState<UserFont[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [editing, setEditing] = useState<MediaAsset | null>(null)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      // Local single-user mode — auth shim always returns our stub user.
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    })()
  }, [router])

  const load = async () => {
    const { data } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
    setAssets((data as MediaAsset[]) ?? [])
    try {
      const res = await fetch('/api/fonts')
      setFonts(res.ok ? ((await res.json()) as UserFont[]) : [])
    } catch {
      setFonts([])
    }
  }
  useEffect(() => { if (user) load() }, [user])

  const shownAssets = useMemo(() => {
    if (filter === FONTS_FILTER) return [] as MediaAsset[]
    const q = search.trim().toLowerCase()
    return assets.filter((a) => {
      if (filter !== 'all' && !(a.categories ?? []).includes(filter)) return false
      if (!q) return true
      const haystack = [
        a.name,
        a.description ?? '',
        a.usage_notes ?? '',
        ...(a.categories ?? []),
        ...(a.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [assets, filter, search])

  const shownFonts = useMemo(() => {
    // Hide fonts when a regular category is active (they don't belong
    // to category buckets). Show them on 'all' or the explicit fonts
    // filter.
    if (filter !== 'all' && filter !== FONTS_FILTER) return [] as UserFont[]
    const q = search.trim().toLowerCase()
    if (!q) return fonts
    return fonts.filter((f) => f.family.toLowerCase().includes(q))
  }, [fonts, filter, search])

  const onDelete = async (asset: MediaAsset) => {
    if (!confirm(`Delete "${asset.name}"? This removes the file too.`)) return
    if (asset.storage_path) {
      await supabase.storage.from('media-assets').remove([asset.storage_path])
    }
    await supabase.from('media_assets').delete().eq('id', asset.id)
    await load()
  }

  const onDeleteFont = async (font: UserFont) => {
    if (!confirm(`Delete font "${font.family}"? Posts using it will fall back to the system sans.`)) return
    const res = await fetch(`/api/fonts/${encodeURIComponent(font.file)}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Delete failed: ' + (await res.text()))
      return
    }
    // Notify <UserFonts /> so the @font-face rule for the deleted
    // family disappears from the document without a hard refresh.
    window.dispatchEvent(new Event(FONTS_CHANGED_EVENT))
    await load()
  }

  if (loading) {
    return (
      <div data-admin className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>Loading…</p>
      </div>
    )
  }
  if (!user) return null

  return (
    <div data-admin className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-[252px]">
        <div className="px-6 py-10">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: 'var(--nw-admin-fg)' }}>
              Assets
            </h1>
            <div className="flex items-center gap-2">
              {/* Primary CTA — matches the landing's install pill shape.
                  Sidebar handles navigation back to Posts now, so no
                  redundant "Back to editor" button in the header. */}
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-4 h-10 text-sm font-medium rounded-full transition-colors"
                style={{
                  background: 'var(--nw-admin-primary)',
                  color: '#FFFFFF',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--nw-admin-primary-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--nw-admin-primary)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Upload
              </button>
            </div>
          </div>

          {/* Search left, filter right — pinned to the edges of the grid. */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            {/* Dark search input — lives on the cream page. Focus ring
                uses the orange accent so it matches the primary CTA. */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, description, tags…"
              className="nw-dark-input px-4 text-sm rounded-full outline-none transition-colors"
              style={{
                background: 'var(--nw-admin-surface-inner)',
                border: '1px solid var(--nw-admin-surface-border)',
                color: 'var(--nw-admin-surface-fg)',
                height: 40,
                minWidth: 320,
                flex: '0 1 420px',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nw-admin-accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--nw-admin-surface-border)' }}
            />
            <CategoryFilter
              filter={filter}
              onChange={setFilter}
              assets={assets}
              fontCount={fonts.length}
            />
          </div>

          {shownAssets.length === 0 && shownFonts.length === 0 ? (
            <div
              className="rounded-3xl flex items-center justify-center py-24"
              style={{
                background: 'var(--nw-admin-surface-outer)',
                border: '1px solid var(--nw-admin-border-outer)',
              }}
            >
              <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>
                No matches. Try a different filter or upload something.
              </p>
            </div>
          ) : (
            <div
              className="grid gap-4"
              // Fluid grid: cards snap into as many columns as fit at a
              // fixed 220px each. Adds columns on wider screens rather
              // than stretching the cards.
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
            >
              {shownFonts.map((f) => (
                <FontCard key={f.file} font={f} onDelete={() => onDeleteFont(f)} />
              ))}
              {shownAssets.map((a) => (
                <AssetCard
                  key={a.id}
                  asset={a}
                  onEdit={() => setEditing(a)}
                  onDelete={() => onDelete(a)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onDone={async () => {
            setShowUpload(false)
            await load()
          }}
        />
      )}

      {editing && (
        <EditModal
          asset={editing}
          onClose={() => setEditing(null)}
          onDone={async () => {
            setEditing(null)
            await load()
          }}
        />
      )}
    </div>
  )
}

function CategoryFilter({
  filter,
  onChange,
  assets,
  fontCount,
}: {
  filter: string
  onChange: (f: string) => void
  assets: MediaAsset[]
  fontCount: number
}) {
  // Ranked by asset count so the most-used category sits at the top
  // of the dropdown. SUGGESTED_CATEGORIES ignored — reflect reality.
  const inUse = useMemo(() => {
    const counts = new Map<string, number>()
    for (const a of assets) {
      for (const c of a.categories ?? []) {
        counts.set(c, (counts.get(c) ?? 0) + 1)
      }
    }
    return Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    )
  }, [assets])

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Click-outside + Esc to close. Listener attaches only while the
  // menu is open so the doc-level handlers don't fire on every click
  // when the app is idle.
  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // No categories AND no fonts? Skip the control entirely. Must come
  // AFTER all hook calls (React enforces stable hook order across
  // renders, and the asset list is empty on the first render before
  // load() resolves).
  if (inUse.length === 0 && fontCount === 0) return null

  const label =
    filter === 'all'
      ? 'All categories'
      : filter === FONTS_FILTER
        ? 'Fonts'
        : filter

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 h-10 text-sm rounded-full transition-colors capitalize"
        style={{
          background: 'var(--nw-admin-surface-inner)',
          border: '1px solid var(--nw-admin-surface-border)',
          color: 'var(--nw-admin-surface-fg)',
          minWidth: 180,
          justifyContent: 'space-between',
        }}
      >
        <span className="truncate">{label}</span>
        <svg
          className="w-3 h-3 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 120ms',
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        // Popover list — capped height + scroll so 100+ categories
        // don't blow out the page. Positioned absolute below the
        // trigger, right-aligned so long labels don't clip off the
        // right edge of the viewport.
        <div
          className="absolute z-30 mt-1 right-0 rounded-2xl overflow-hidden"
          style={{
            minWidth: 220,
            maxHeight: 360,
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-surface-border)',
            boxShadow: '0 8px 24px rgba(24,18,15,0.08)',
          }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: 358 }}>
            <DropdownItem
              label="All categories"
              active={filter === 'all'}
              onClick={() => {
                onChange('all')
                setOpen(false)
              }}
            />
            {fontCount > 0 && (
              // Fonts is a synthetic category (fonts don't live in
              // media_assets). Sits at the top of the list under "All"
              // so it's findable, with the live count of registered
              // user fonts.
              <DropdownItem
                label="Fonts"
                count={fontCount}
                active={filter === FONTS_FILTER}
                onClick={() => {
                  onChange(FONTS_FILTER)
                  setOpen(false)
                }}
              />
            )}
            {inUse.map(([name, count]) => (
              <DropdownItem
                key={name}
                label={name}
                count={count}
                active={filter === name}
                onClick={() => {
                  onChange(name)
                  setOpen(false)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors capitalize text-left"
      style={{
        background: active ? 'var(--nw-admin-hover)' : 'transparent',
        color: 'var(--nw-admin-fg)',
        fontWeight: active ? 500 : 400,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--nw-admin-hover)'
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent'
      }}
    >
      <span className="truncate">{label}</span>
      {count != null && (
        <span
          className="text-xs tabular-nums shrink-0"
          style={{ color: 'var(--nw-admin-muted)' }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

// Font card. Same outer shell + aspect ratio as AssetCard so the grid
// stays visually uniform. The "preview" is "Aa Bb Cc" rendered in the
// uploaded font (registered via @font-face by <UserFonts />), centered
// large in the card. The font's family name shows as the card title.
function FontCard({ font, onDelete }: { font: UserFont; onDelete: () => void }) {
  // Quote the family in the inline style so names with spaces or
  // hyphens still match the @font-face rule.
  const familyCss = `"${font.family.replace(/"/g, '\\"')}", system-ui, sans-serif`
  return (
    <div
      className="rounded-3xl"
      style={{
        background: 'var(--nw-admin-surface-outer)',
        border: '1px solid var(--nw-admin-border-outer)',
        padding: 12,
      }}
    >
      <div
        className="rounded-2xl overflow-hidden relative aspect-square flex items-center justify-center px-4"
        style={{
          background: 'var(--nw-admin-surface-inner)',
          border: '1px solid rgba(24,18,15,0.06)',
        }}
      >
        {/* Specimen string sits on a single line, horizontally centered.
            "AaBbCc" run-together (no spaces) is the convention Apple's
            Font Book and most type-foundry one-line specimens use; it
            shows uppercase + lowercase forms in one glance. */}
        <p
          className="select-none"
          style={{
            fontFamily: familyCss,
            fontSize: 36,
            fontWeight: 500,
            color: 'var(--nw-admin-fg)',
            lineHeight: 1,
            letterSpacing: 0,
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          AaBbCc
        </p>
        <span
          className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            color: 'var(--nw-admin-fg)',
            border: '1px solid rgba(24,18,15,0.08)',
          }}
        >
          Font
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <p
          className="text-sm font-medium truncate"
          style={{ color: 'var(--nw-admin-fg)' }}
          title={font.family}
        >
          {font.family}
        </p>
        <p
          className="text-[11px] leading-snug"
          style={{ color: 'rgba(24,18,15,0.55)' }}
        >
          {font.format} · {(font.size / 1024).toFixed(0)} KB
        </p>
        <div className="flex items-center gap-1 pt-1">
          <IconAction onClick={onDelete} title="Delete" danger>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
          </IconAction>
        </div>
      </div>
    </div>
  )
}

function AssetCard({
  asset,
  onEdit,
  onDelete,
}: {
  asset: MediaAsset
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div
      className="rounded-3xl"
      style={{
        background: 'var(--nw-admin-surface-outer)',
        border: '1px solid var(--nw-admin-border-outer)',
        padding: 12,
      }}
    >
      <div
        className="rounded-2xl overflow-hidden relative aspect-square"
        style={{
          background:
            'repeating-conic-gradient(rgba(24,18,15,0.04) 0% 25%, transparent 0% 50%) 50% / 16px 16px',
          border: '1px solid rgba(24,18,15,0.06)',
        }}
      >
        {asset.kind === 'component' ? (
          // Render the component at its native slide size (1000×1250)
          // and scale-down to fit the preview card. Avoids the
          // text-wrap-and-clip problem from rendering at the card's
          // 200px width directly. Dark backdrop (#0A0A0A, the dark
          // theme bg) so light-text-on-transparent components are
          // visible — most slides ship dark anyway, so this matches
          // the most common use context.
          <ScaledComponentPreview source={asset.source_code ?? ''} nativeW={asset.width} nativeH={asset.height} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.file_url ?? ''}
            alt={asset.name}
            className="w-full h-full object-contain p-6"
            loading="lazy"
          />
        )}
        <span
          className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            color: 'var(--nw-admin-fg)',
            border: '1px solid rgba(24,18,15,0.08)',
          }}
        >
          {asset.kind === 'component' ? 'Code' : 'Image'}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--nw-admin-fg)' }}>
          {asset.name}
        </p>
        <p
          className="text-[11px] leading-snug line-clamp-2"
          style={{ color: 'rgba(24,18,15,0.55)' }}
          title={asset.description ?? ''}
        >
          {asset.description || <span style={{ color: 'rgba(24,18,15,0.35)' }}>No description</span>}
        </p>
        {(asset.categories ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(asset.categories ?? []).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[10px] rounded-full"
                style={{
                  background: 'rgba(24,18,15,0.04)',
                  color: 'rgba(24,18,15,0.6)',
                  border: '1px solid rgba(24,18,15,0.06)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 pt-1">
          <IconAction onClick={onEdit} title="Edit">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
          </IconAction>
          <IconAction onClick={onDelete} title="Delete" danger>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
          </IconAction>
        </div>
      </div>
    </div>
  )
}

// Renders a code-component asset at its native slide size (1000×1250)
// then scales the whole thing down to fit the preview card. This is
// the same pattern the home grid uses for post thumbnails — preserves
// proportions, prevents text-wrap distortion, and works for components
// whose authors assumed full-slide bounds. Backdrop is the dark theme
// bg so light text on transparent backgrounds reads.
function ScaledComponentPreview({
  source,
  nativeW,
  nativeH,
}: {
  source: string
  /** Asset's saved width — the dimensions of the layer it was
   *  saved from. We render at THIS size so the component looks
   *  identical to the slide use, then scale uniformly to fit. Falls
   *  back to the full canvas size when the asset has no width. */
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
      const r = el.getBoundingClientRect()
      // Contain-fit with a margin: scale so the WHOLE component (at
      // its native saved size) fits inside the card with breathing
      // room. Using the asset's true w/h instead of the full canvas
      // means borders, paddings and proportions render exactly like
      // they do on a slide — no stretching from a 880×600 chart into
      // a 1000×1250 frame, which would round-down the borderRadius.
      const MARGIN = 0.86
      setScale(Math.min(r.width / W, r.height / H) * MARGIN)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [W, H])

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden flex items-center justify-center"
      // Auto-pick a backdrop that complements the component. Source
      // that uses white/cream backgrounds gets a cream backdrop;
      // anything else gets the dark slide bg. Means light-mode
      // components (charts on cream slides) don't render against a
      // black void in the library.
      style={{ background: pickPreviewBg(source) }}
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

// Pick a backdrop that suits the component's design. Looks at the
// FIRST `background:` declaration in the source — light colors get a
// cream backdrop (matches the light-theme slide), everything else
// gets the dark slide bg. Cheap heuristic, works for our patterns.
function pickPreviewBg(source: string): string {
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

function IconAction({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode
  onClick?: () => void
  title: string
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="inline-flex items-center justify-center transition-colors cursor-pointer"
      style={{
        width: 28,
        height: 28,
        borderRadius: 9999,
        background: 'transparent',
        color: danger ? '#DC2626' : 'rgba(24,18,15,0.6)',
        border: '1px solid rgba(24,18,15,0.08)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(24,18,15,0.04)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

// ─── Upload / Edit modal ───────────────────────────────────────────
// Same shell for both; EditModal pre-fills from an existing asset.

// UI-only kind that adds 'font' on top of the domain AssetKind. Fonts
// don't get rows in media_assets; they live as files under
// ~/.redesign/fonts/ and the UploadModal branches on this to call
// /api/fonts instead of the assets table.
type DraftKind = AssetKind | 'font'

type DraftForm = {
  kind: DraftKind
  name: string
  description: string
  usage_notes: string
  categories: string[]
  /** Comma-separated source buffer for the tag input. */
  categoryInput: string
  file: File | null
  previewUrl: string | null
  source_code: string
}

function emptyDraft(): DraftForm {
  return {
    kind: 'image',
    name: '',
    description: '',
    usage_notes: '',
    categories: [],
    categoryInput: '',
    file: null,
    previewUrl: null,
    source_code: '',
  }
}

function UploadModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: () => void
}) {
  const [draft, setDraft] = useState<DraftForm>(() => emptyDraft())
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    // Fonts skip the asset metadata fields; just need the file.
    if (draft.kind === 'font') {
      if (!draft.file) {
        alert('Drop or pick a font file (.ttf, .otf, .woff, .woff2).')
        return
      }
      setSubmitting(true)
      try {
        const form = new FormData()
        form.append('file', draft.file)
        const res = await fetch('/api/fonts', { method: 'POST', body: form })
        const json = (await res.json()) as { family?: string; error?: string }
        if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
        // Tell <UserFonts /> in the root layout to refetch and inject
        // the new @font-face rule. Without this, the new FontCard
        // renders in the fallback sans until the user hard-refreshes.
        window.dispatchEvent(new Event(FONTS_CHANGED_EVENT))
        alert(
          `Font uploaded. Use fontFamily "${json.family}" on text layers.`,
        )
        onDone()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        alert(`Upload failed: ${msg}`)
      } finally {
        setSubmitting(false)
      }
      return
    }
    if (!draft.name.trim()) {
      alert('Name is required.')
      return
    }
    if (draft.kind === 'image' && !draft.file) {
      alert('Drop or pick an image file.')
      return
    }
    if (draft.kind === 'component' && !draft.source_code.trim()) {
      alert('Paste the TSX source.')
      return
    }
    setSubmitting(true)
    try {
      let file_url: string | null = null
      let storage_path: string | null = null
      let mime_type: string | null = null
      let width: number | null = null
      let height: number | null = null
      if (draft.kind === 'image' && draft.file) {
        const safe = draft.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `upload/${cryptoId()}-${safe}`
        const up = await supabase.storage
          .from('media-assets')
          .upload(path, draft.file, { cacheControl: '3600', upsert: false })
        if (up.error) throw new Error(up.error.message)
        const { data: pub } = supabase.storage.from('media-assets').getPublicUrl(path)
        file_url = pub.publicUrl
        storage_path = path
        mime_type = draft.file.type
        const dim = await probeImageSize(draft.file).catch(() => null)
        width = dim?.w ?? null
        height = dim?.h ?? null
      }
      const tail = [draft.categoryInput.trim()].filter(Boolean)
      const categories = Array.from(new Set([...draft.categories, ...tail]))
      const { error } = await supabase.from('media_assets').insert({
        kind: draft.kind,
        name: draft.name,
        description: draft.description || null,
        usage_notes: draft.usage_notes || null,
        categories,
        file_url,
        storage_path,
        source_code: draft.kind === 'component' ? draft.source_code : null,
        mime_type,
        width,
        height,
      })
      if (error) throw new Error(error.message)
      onDone()
    } catch (err: any) {
      alert(`Upload failed: ${err?.message ?? err}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Branch the modal copy so a font upload reads as a font upload, not
  // the generic "asset" wording, which is confusing when fonts aren't
  // assets in the DB sense.
  const isFont = draft.kind === 'font'
  return (
    <AssetFormModal
      title={isFont ? 'New font' : 'New asset'}
      submitLabel={
        isFont
          ? submitting ? 'Uploading…' : 'Upload font'
          : submitting ? 'Saving…' : 'Save asset'
      }
      onSubmit={submit}
      onClose={onClose}
      submitting={submitting}
      draft={draft}
      setDraft={setDraft}
    />
  )
}

function EditModal({
  asset,
  onClose,
  onDone,
}: {
  asset: MediaAsset
  onClose: () => void
  onDone: () => void
}) {
  const [draft, setDraft] = useState<DraftForm>(() => ({
    kind: asset.kind,
    name: asset.name,
    description: asset.description ?? '',
    usage_notes: asset.usage_notes ?? '',
    categories: asset.categories ?? [],
    categoryInput: '',
    file: null,
    previewUrl: asset.file_url,
    source_code: asset.source_code ?? '',
  }))
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!draft.name.trim()) {
      alert('Name is required.')
      return
    }
    setSubmitting(true)
    try {
      let file_url = asset.file_url
      let storage_path = asset.storage_path
      let mime_type = asset.mime_type
      let width = asset.width
      let height = asset.height
      if (draft.kind === 'image' && draft.file) {
        // Replace: upload in place, cache-bust the URL.
        const path =
          asset.storage_path ?? `upload/${cryptoId()}-${draft.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const up = await supabase.storage
          .from('media-assets')
          .upload(path, draft.file, {
            contentType: draft.file.type,
            upsert: true,
            cacheControl: '3600',
          })
        if (up.error) throw new Error(up.error.message)
        const { data: pub } = supabase.storage.from('media-assets').getPublicUrl(path)
        file_url = `${pub.publicUrl}?v=${Date.now()}`
        storage_path = path
        mime_type = draft.file.type
        const dim = await probeImageSize(draft.file).catch(() => null)
        width = dim?.w ?? null
        height = dim?.h ?? null
      }
      const tail = [draft.categoryInput.trim()].filter(Boolean)
      const categories = Array.from(new Set([...draft.categories, ...tail]))
      const { error } = await supabase
        .from('media_assets')
        .update({
          name: draft.name,
          description: draft.description || null,
          usage_notes: draft.usage_notes || null,
          categories,
          file_url,
          storage_path,
          source_code: draft.kind === 'component' ? draft.source_code : null,
          mime_type,
          width,
          height,
        })
        .eq('id', asset.id)
      if (error) throw new Error(error.message)
      onDone()
    } catch (err: any) {
      alert(`Save failed: ${err?.message ?? err}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AssetFormModal
      title={`Edit · ${asset.name}`}
      submitLabel={submitting ? 'Saving…' : 'Save changes'}
      onSubmit={submit}
      onClose={onClose}
      submitting={submitting}
      draft={draft}
      setDraft={setDraft}
      lockKind
    />
  )
}

function AssetFormModal({
  title,
  submitLabel,
  onSubmit,
  onClose,
  submitting,
  draft,
  setDraft,
  lockKind,
}: {
  title: string
  submitLabel: string
  onSubmit: () => void
  onClose: () => void
  submitting: boolean
  draft: DraftForm
  // Accept both the value form and the React updater form so callers
  // can use functional updates when they need the latest committed
  // state (the categories multiselect race fix relies on this).
  setDraft: React.Dispatch<React.SetStateAction<DraftForm>>
  lockKind?: boolean
}) {
  return (
    <div
      data-admin
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
      style={{
        background: 'rgba(24,18,15,0.25)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-3xl my-auto"
        style={{
          maxWidth: 720,
          background: 'var(--nw-admin-surface-inner)',
          border: '1px solid var(--nw-admin-border-outer)',
          padding: 14,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-3xl p-6"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-border-inner)',
          }}
        >
          <h2 className="text-2xl font-semibold tracking-tight mb-5" style={{ color: 'var(--nw-admin-fg)' }}>
            {title}
          </h2>

          {!lockKind && (
            <div className="mb-5">
              <Label>Type</Label>
              <KindToggle
                value={draft.kind}
                onChange={(kind) => setDraft({ ...draft, kind })}
              />
            </div>
          )}

          {/* Media area: image drop zone, code textarea, or font drop. */}
          {draft.kind === 'image' && (
            <div className="mb-5">
              <Label>File</Label>
              <DropZone
                file={draft.file}
                previewUrl={draft.previewUrl}
                onFile={(file) => {
                  setDraft({
                    ...draft,
                    file,
                    previewUrl: file ? URL.createObjectURL(file) : null,
                  })
                }}
              />
            </div>
          )}
          {draft.kind === 'component' && (
            <div className="mb-5">
              <Label>Source (TSX)</Label>
              <textarea
                value={draft.source_code}
                onChange={(e) => setDraft({ ...draft, source_code: e.target.value })}
                rows={10}
                spellCheck={false}
                placeholder={`<div style={{ display: 'flex', ... }}>\n  …\n</div>`}
                className="w-full px-4 py-3 rounded-2xl outline-none resize-none transition-colors"
                style={{
                  background: 'var(--nw-admin-surface-inner)',
                  border: '1px solid rgba(24,18,15,0.12)',
                  color: 'var(--nw-admin-fg)',
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              />
              {draft.source_code.trim() && (
                <div
                  className="mt-3 rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(24,18,15,0.08)',
                    aspectRatio: '4 / 3',
                    background: 'var(--nw-admin-surface-inner)',
                  }}
                >
                  <CodeRunner source={draft.source_code} />
                </div>
              )}
            </div>
          )}
          {draft.kind === 'font' && (
            <div className="mb-5">
              <Label>Font file</Label>
              <FontDropZone
                file={draft.file}
                onFile={(file) => setDraft({ ...draft, file, previewUrl: null })}
              />
              <p className="mt-3 text-[12px]" style={{ color: 'var(--nw-admin-muted)' }}>
                Accepts .ttf, .otf, .woff, .woff2. Maximum 5 MB. The font family
                will be the filename without extension; reference it by that
                exact name in any text layer.
              </p>
            </div>
          )}

          {draft.kind !== 'font' && (
          <>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Title</Label>
              <InputText
                value={draft.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
                placeholder="e.g. Mesh blue"
              />
            </div>
            <div>
              <Label>Categories</Label>
              <CategoryMultiselect
                value={draft.categories}
                // Functional updates here are load-bearing: when the
                // input is blurred or Enter is pressed, the multiselect
                // calls onChange + setInput back-to-back. With plain
                // `setDraft({...draft, X})` form, the second call uses
                // a stale draft and overwrites the first — categories
                // would silently revert. Use the updater form so each
                // call sees the latest committed draft.
                onChange={(v) => setDraft((d) => ({ ...d, categories: v }))}
                input={draft.categoryInput}
                setInput={(v) => setDraft((d) => ({ ...d, categoryInput: v }))}
              />
            </div>
          </div>

          <div className="mb-4">
            <Label>Description</Label>
            <InputTextArea
              value={draft.description}
              onChange={(v) => setDraft({ ...draft, description: v })}
              placeholder="What this asset is."
              rows={2}
            />
          </div>

          <div className="mb-5">
            <Label>Rules to use</Label>
            <InputTextArea
              value={draft.usage_notes}
              onChange={(v) => setDraft({ ...draft, usage_notes: v })}
              placeholder="When and how the asset should be used. Surfaced to Claude via the MCP."
              rows={3}
            />
          </div>
          </>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-5 text-sm rounded-full transition-colors"
              style={{
                background: 'transparent',
                color: 'var(--nw-admin-muted)',
                border: '1px solid var(--nw-admin-border-outer)',
                height: 44,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="px-5 text-sm font-medium rounded-full transition-colors disabled:opacity-50"
              style={{ background: 'var(--nw-admin-primary)', color: '#FFFFFF', height: 44 }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary-hover)' }}
              onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary)' }}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: 'rgba(24,18,15,0.5)' }}>
      {children}
    </p>
  )
}

// Three-segment toggle. The active-pill `left` formula is computed so
// the indicator slides cleanly between the three positions.
function KindToggle({ value, onChange }: { value: DraftKind; onChange: (k: DraftKind) => void }) {
  const options: { key: DraftKind; label: string }[] = [
    { key: 'image', label: 'Image' },
    { key: 'component', label: 'Component' },
    { key: 'font', label: 'Font' },
  ]
  const index = Math.max(0, options.findIndex((o) => o.key === value))
  const segment = 100 / options.length
  return (
    <div
      className="relative flex items-center rounded-full w-full"
      style={{
        height: 44,
        background: 'var(--nw-admin-surface-inner)',
        border: '1px solid rgba(24,18,15,0.08)',
        padding: 4,
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: 4, bottom: 4,
          left: `calc(${index * segment}% + 4px)`,
          width: `calc(${segment}% - 8px)`,
          background: 'rgba(24,18,15,0.08)',
          border: '1px solid rgba(24,18,15,0.18)',
          transition: 'left 250ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {options.map((o) => {
        const active = value === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className="relative z-10 flex-1 text-sm rounded-full"
            style={{
              color: active ? 'var(--nw-admin-fg)' : 'rgba(24,18,15,0.55)',
              fontWeight: active ? 500 : 400,
              height: '100%',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function DropZone({
  file,
  previewUrl,
  onFile,
}: {
  file: File | null
  previewUrl: string | null
  onFile: (f: File | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setHovered(true) }}
      onDragLeave={() => setHovered(false)}
      onDrop={(e) => {
        e.preventDefault()
        setHovered(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f)
      }}
      className="relative flex items-center justify-center rounded-3xl cursor-pointer overflow-hidden"
      style={{
        aspectRatio: '4 / 3',
        background:
          'repeating-conic-gradient(rgba(24,18,15,0.04) 0% 25%, transparent 0% 50%) 50% / 24px 24px',
        border: `1px dashed ${hovered ? 'var(--nw-admin-accent)' : 'rgba(24,18,15,0.18)'}`,
      }}
    >
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(24,18,15,0.35)' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm" style={{ color: 'rgba(24,18,15,0.55)' }}>
            Drop an image, or click to pick
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(24,18,15,0.4)' }}>
            PNG transparency and SVG are preserved.
          </p>
        </div>
      )}
      <input
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.currentTarget.value = ''
        }}
      />
      {file && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFile(null) }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid rgba(24,18,15,0.12)',
            color: 'var(--nw-admin-fg)',
          }}
          aria-label="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </label>
  )
}

// Drop target for fonts. Same shell as DropZone but slimmer (fonts have
// no preview to show), accepts only .ttf/.otf/.woff/.woff2, and
// surfaces the chosen filename instead of an image preview.
function FontDropZone({
  file,
  onFile,
}: {
  file: File | null
  onFile: (f: File | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setHovered(true) }}
      onDragLeave={() => setHovered(false)}
      onDrop={(e) => {
        e.preventDefault()
        setHovered(false)
        const f = e.dataTransfer.files?.[0]
        if (f) onFile(f)
      }}
      className="relative flex items-center justify-center rounded-3xl cursor-pointer overflow-hidden"
      style={{
        height: 140,
        background: 'var(--nw-admin-surface-inner)',
        border: `1px dashed ${hovered ? 'var(--nw-admin-accent)' : 'rgba(24,18,15,0.18)'}`,
      }}
    >
      {file ? (
        <div className="flex flex-col items-center gap-1 text-center pointer-events-none px-4">
          <p className="text-sm font-medium truncate max-w-full" style={{ color: 'var(--nw-admin-fg)' }}>
            {file.name}
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(24,18,15,0.5)' }}>
            {(file.size / 1024).toFixed(0)} KB ready to upload
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(24,18,15,0.35)' }}>
            <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
          <p className="text-sm" style={{ color: 'rgba(24,18,15,0.55)' }}>
            Drop a font file, or click to pick
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(24,18,15,0.4)' }}>
            .ttf, .otf, .woff, .woff2 up to 5 MB
          </p>
        </div>
      )}
      <input
        type="file"
        accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.currentTarget.value = ''
        }}
      />
      {file && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFile(null) }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid rgba(24,18,15,0.12)',
            color: 'var(--nw-admin-fg)',
          }}
          aria-label="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </label>
  )
}

function InputText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
  )
}

function InputTextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 text-sm rounded-2xl outline-none resize-none transition-colors"
      style={{
        background: 'var(--nw-admin-surface-inner)',
        border: '1px solid rgba(24,18,15,0.12)',
        color: 'var(--nw-admin-fg)',
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nw-admin-accent)' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(24,18,15,0.12)' }}
    />
  )
}

function CategoryMultiselect({
  value,
  onChange,
  input,
  setInput,
}: {
  value: string[]
  onChange: (v: string[]) => void
  input: string
  setInput: (v: string) => void
}) {
  const addCurrent = () => {
    const v = input.trim()
    if (!v) return
    if (value.includes(v)) {
      setInput('')
      return
    }
    onChange([...value, v])
    setInput('')
  }
  return (
    <div
      className="rounded-full flex items-center gap-1.5 flex-wrap transition-colors"
      style={{
        minHeight: 44,
        background: 'var(--nw-admin-surface-inner)',
        border: '1px solid rgba(24,18,15,0.12)',
        // Match the horizontal padding of <InputText> (px-4 = 16px)
        // so the placeholder/value lines up with the other form fields.
        padding: '4px 16px',
      }}
    >
      {value.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full"
          style={{
            background: 'rgba(24,18,15,0.06)',
            color: 'var(--nw-admin-fg)',
            border: '1px solid rgba(24,18,15,0.1)',
          }}
        >
          {c}
          <button
            type="button"
            onClick={() => onChange(value.filter((x) => x !== c))}
            className="opacity-60 hover:opacity-100"
            aria-label={`Remove ${c}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        list="category-suggestions"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addCurrent()
          } else if (e.key === 'Backspace' && !input && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={addCurrent}
        placeholder={value.length ? '' : 'Type + enter'}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm"
        style={{ color: 'var(--nw-admin-fg)', height: 28 }}
      />
      <datalist id="category-suggestions">
        {SUGGESTED_CATEGORIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  )
}

function probeImageSize(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = (e) => {
      reject(e)
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}
