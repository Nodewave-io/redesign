'use client'

// Full catalog of every asset in the library. The source of truth for
// the creative toolbox: upload, rename, retag, replace files, delete.
// The editor's left-panel picker only *inserts* — management happens
// here.

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/sidebar'
import {
  AssetKind,
  MediaAsset,
  SUGGESTED_CATEGORIES,
  cryptoId,
} from '../_lib/types'
import { CodeRunner } from '../_lib/code-runtime'

export default function AssetsCatalog() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [assets, setAssets] = useState<MediaAsset[]>([])
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
  }
  useEffect(() => { if (user) load() }, [user])

  const shown = useMemo(() => {
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

  const onDelete = async (asset: MediaAsset) => {
    if (!confirm(`Delete "${asset.name}"? This removes the file too.`)) return
    if (asset.storage_path) {
      await supabase.storage.from('media-assets').remove([asset.storage_path])
    }
    await supabase.from('media_assets').delete().eq('id', asset.id)
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
            <CategoryFilter filter={filter} onChange={setFilter} assets={assets} />
          </div>

          {shown.length === 0 ? (
            <div
              className="rounded-3xl flex items-center justify-center py-24"
              style={{
                background: 'var(--nw-admin-surface-outer)',
                border: '1px solid var(--nw-admin-border-outer)',
              }}
            >
              <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>
                Nothing matches. Adjust the filter or upload something.
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
              {shown.map((a) => (
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
}: {
  filter: string
  onChange: (f: string) => void
  assets: MediaAsset[]
}) {
  const inUse = useMemo(() => {
    const s = new Set<string>()
    for (const a of assets) {
      for (const c of a.categories ?? []) s.add(c)
    }
    return Array.from(s).sort()
  }, [assets])

  const options = ['all', ...new Set([...SUGGESTED_CATEGORIES, ...inUse])]

  return (
    <div
      className="inline-flex items-center rounded-full p-1 flex-wrap"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(15,18,17,0.08)',
      }}
    >
      {options.map((opt) => {
        const active = filter === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="px-3 text-xs rounded-full transition-colors capitalize"
            style={{
              background: active ? 'rgba(15,18,17,0.08)' : 'transparent',
              color: active ? '#0F1211' : 'rgba(15,18,17,0.55)',
              fontWeight: active ? 500 : 400,
              border: active ? '1px solid rgba(15,18,17,0.18)' : '1px solid transparent',
              height: 36,
            }}
          >
            {opt}
          </button>
        )
      })}
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
            'repeating-conic-gradient(rgba(15,18,17,0.04) 0% 25%, transparent 0% 50%) 50% / 16px 16px',
          border: '1px solid rgba(15,18,17,0.06)',
        }}
      >
        {asset.kind === 'component' ? (
          <div className="absolute inset-0 bg-white">
            <CodeRunner source={asset.source_code ?? ''} />
          </div>
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
            background: '#FFFFFF',
            color: '#0F1211',
            border: '1px solid rgba(15,18,17,0.08)',
          }}
        >
          {asset.kind === 'component' ? 'Code' : 'Image'}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium truncate" style={{ color: '#0F1211' }}>
          {asset.name}
        </p>
        <p
          className="text-[11px] leading-snug line-clamp-2"
          style={{ color: 'rgba(15,18,17,0.55)' }}
          title={asset.description ?? ''}
        >
          {asset.description || <span style={{ color: 'rgba(15,18,17,0.35)' }}>No description</span>}
        </p>
        {(asset.categories ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(asset.categories ?? []).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[10px] rounded-full"
                style={{
                  background: 'rgba(15,18,17,0.04)',
                  color: 'rgba(15,18,17,0.6)',
                  border: '1px solid rgba(15,18,17,0.06)',
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
        color: danger ? '#DC2626' : 'rgba(15,18,17,0.6)',
        border: '1px solid rgba(15,18,17,0.08)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,18,17,0.04)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

// ─── Upload / Edit modal ───────────────────────────────────────────
// Same shell for both; EditModal pre-fills from an existing asset.

type DraftForm = {
  kind: AssetKind
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

  return (
    <AssetFormModal
      title="New asset"
      submitLabel={submitting ? 'Uploading…' : 'Save asset'}
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
  setDraft: (d: DraftForm) => void
  lockKind?: boolean
}) {
  return (
    <div
      data-admin
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto"
      style={{
        background: 'rgba(15,18,17,0.25)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-3xl my-auto"
        style={{
          maxWidth: 720,
          background: '#FFFFFF',
          border: '1px solid var(--nw-admin-border-outer)',
          padding: 14,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-3xl p-6"
          style={{
            background: '#FFFFFF',
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

          {/* Media area: drop zone (image) or source textarea (code). */}
          {draft.kind === 'image' ? (
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
          ) : (
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
                  background: '#FFFFFF',
                  border: '1px solid rgba(15,18,17,0.12)',
                  color: '#0F1211',
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              />
              {draft.source_code.trim() && (
                <div
                  className="mt-3 rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(15,18,17,0.08)',
                    aspectRatio: '4 / 3',
                    background: '#FFFFFF',
                  }}
                >
                  <CodeRunner source={draft.source_code} />
                </div>
              )}
            </div>
          )}

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
                onChange={(v) => setDraft({ ...draft, categories: v })}
                input={draft.categoryInput}
                setInput={(v) => setDraft({ ...draft, categoryInput: v })}
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
    <p className="text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: 'rgba(15,18,17,0.5)' }}>
      {children}
    </p>
  )
}

function KindToggle({ value, onChange }: { value: AssetKind; onChange: (k: AssetKind) => void }) {
  return (
    <div
      className="relative flex items-center rounded-full w-full"
      style={{
        height: 44,
        background: '#FFFFFF',
        border: '1px solid rgba(15,18,17,0.08)',
        padding: 4,
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: 4, bottom: 4,
          left: value === 'image' ? 4 : 'calc(50% + 0px)',
          width: 'calc(50% - 4px)',
          background: 'rgba(15,18,17,0.08)',
          border: '1px solid rgba(15,18,17,0.18)',
          transition: 'left 250ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <button
        type="button"
        onClick={() => onChange('image')}
        className="relative z-10 flex-1 text-sm rounded-full"
        style={{
          color: value === 'image' ? '#0F1211' : 'rgba(15,18,17,0.55)',
          fontWeight: value === 'image' ? 500 : 400,
          height: '100%',
        }}
      >
        Image
      </button>
      <button
        type="button"
        onClick={() => onChange('component')}
        className="relative z-10 flex-1 text-sm rounded-full"
        style={{
          color: value === 'component' ? '#0F1211' : 'rgba(15,18,17,0.55)',
          fontWeight: value === 'component' ? 500 : 400,
          height: '100%',
        }}
      >
        Component
      </button>
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
          'repeating-conic-gradient(rgba(15,18,17,0.04) 0% 25%, transparent 0% 50%) 50% / 24px 24px',
        border: `1px dashed ${hovered ? 'var(--nw-admin-accent)' : 'rgba(15,18,17,0.18)'}`,
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(15,18,17,0.35)' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-sm" style={{ color: 'rgba(15,18,17,0.55)' }}>
            Drop an image, or click to pick
          </p>
          <p className="text-[11px]" style={{ color: 'rgba(15,18,17,0.4)' }}>
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
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
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
        background: '#FFFFFF',
        border: '1px solid rgba(15,18,17,0.12)',
        color: '#0F1211',
        height: 44,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nw-admin-accent)' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(15,18,17,0.12)' }}
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
        background: '#FFFFFF',
        border: '1px solid rgba(15,18,17,0.12)',
        color: '#0F1211',
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--nw-admin-accent)' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(15,18,17,0.12)' }}
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
      className="rounded-full flex items-center gap-1.5 flex-wrap px-3 transition-colors"
      style={{
        minHeight: 44,
        background: '#FFFFFF',
        border: '1px solid rgba(15,18,17,0.12)',
        padding: '4px 8px',
      }}
    >
      {value.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full"
          style={{
            background: 'rgba(15,18,17,0.06)',
            color: '#0F1211',
            border: '1px solid rgba(15,18,17,0.1)',
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
        style={{ color: '#0F1211', height: 28 }}
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
