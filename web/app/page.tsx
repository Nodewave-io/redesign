'use client'

// Collections overview, the new home. Posts are grouped into
// collections (e.g. one per company / client / topic), and the
// drilled-in /collections/[id] page is where the actual post grid
// lives. Clicking "Collections" in the sidebar from inside a
// collection or the editor returns to this page.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/sidebar'
import { SlideThumb } from '@/app/_components/slide-thumb'
import type { Layer, Slide } from '@/app/_lib/types'

type RecentPost = {
  id: string
  theme: 'dark' | 'light'
  slides: { slides: Slide[]; layers: Layer[] } | null
}

type CollectionRow = {
  id: string
  name: string
  created_at: string
  updated_at: string
  post_count: number
  recent_posts: RecentPost[]
}

export default function CollectionsHomePage() {
  const router = useRouter()
  const [user, setUser] = useState<unknown>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [collections, setCollections] = useState<CollectionRow[] | null>(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthLoading(false)
    })()
  }, [])

  const load = async () => {
    const res = await fetch('/api/collections')
    setCollections((await res.json()) as CollectionRow[])
  }
  useEffect(() => {
    if (user) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const onCreate = async () => {
    const name = window.prompt('Name your new collection')?.trim()
    if (!name) return
    setCreating(true)
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error(await res.text())
      const created = (await res.json()) as CollectionRow
      router.push(`/collections/${created.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert('Create failed: ' + msg)
    } finally {
      // Reset even on success in case router.push silently fails or
      // the user navigates back; otherwise the button stays disabled.
      setCreating(false)
    }
  }

  const onRename = async (c: CollectionRow) => {
    const next = window.prompt('Rename collection', c.name)?.trim()
    if (!next || next === c.name) return
    try {
      const res = await fetch(`/api/collections/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: next }),
      })
      if (!res.ok) throw new Error(await res.text())
      load()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert('Rename failed: ' + msg)
    }
  }

  const onDelete = async (c: CollectionRow) => {
    // Repo refuses to delete a collection that still has posts; surface
    // that as a friendly confirm message ahead of the API call.
    if (c.post_count > 0) {
      alert(
        `"${c.name}" still has ${c.post_count} post${c.post_count === 1 ? '' : 's'}. ` +
          `Open it and delete or move them first.`,
      )
      return
    }
    if (!confirm(`Delete collection "${c.name}"? This can't be undone.`)) return
    const res = await fetch(`/api/collections/${c.id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Delete failed: ' + (await res.text()))
      return
    }
    setCollections((cs) => cs?.filter((x) => x.id !== c.id) ?? null)
  }

  if (authLoading) {
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
      <main className="flex-1 md:ml-[252px] flex flex-col">
        <div className="px-6 py-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: 'var(--nw-admin-fg)' }}>
              Collections
            </h1>
            <PrimaryButton onClick={onCreate} disabled={creating}>
              {creating ? 'Creating…' : 'New collection'}
            </PrimaryButton>
          </div>

          {collections == null ? (
            <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>
              Loading collections…
            </p>
          ) : collections.length === 0 ? (
            <div>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: 'var(--nw-admin-muted)' }}
              >
                No collections yet. Create one for your first batch of posts.
              </p>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
              >
                <EmptyCollectionCard onClick={onCreate} disabled={creating} />
              </div>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
            >
              {collections.map((c) => (
                <CollectionCard
                  key={c.id}
                  collection={c}
                  onRename={() => onRename(c)}
                  onDelete={() => onDelete(c)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 text-sm font-medium rounded-full transition-colors disabled:opacity-50 h-10"
      style={{
        background: 'var(--nw-admin-primary)',
        color: '#FFFFFF',
      }}
      onMouseEnter={(e) => {
        if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary-hover)'
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary)'
      }}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
      {children}
    </button>
  )
}

function EmptyCollectionCard({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  const GREY = 'var(--nw-admin-muted)'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-3xl flex flex-col text-left transition-colors disabled:opacity-50"
      style={{
        background: 'var(--nw-admin-surface-outer)',
        border: '1px solid var(--nw-admin-surface-border)',
        padding: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!e.currentTarget.disabled) {
          e.currentTarget.style.background = 'var(--nw-admin-surface-inner)'
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.disabled) {
          e.currentTarget.style.background = 'var(--nw-admin-surface-outer)'
        }
      }}
    >
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{
          aspectRatio: '4 / 5',
          background: 'transparent',
          border: `1px dashed ${GREY}`,
          color: GREY,
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <div className="pt-3 pb-2 px-1">
        <p className="text-sm font-medium truncate" style={{ color: GREY }}>
          Create your first collection
        </p>
        <p className="text-[11px]" style={{ color: GREY }}>
          group posts by company, client, or topic
        </p>
      </div>
    </button>
  )
}

// 2x2 mosaic of the collection's 4 most-recently-updated posts. Each
// cell is exactly a quarter of the card thumbnail (2x2 inside a 4:5
// area gives 4:5 cells, matching slide aspect). Empty cells fall
// through to the surface-inner background so a 1- or 2-post collection
// still reads as "has stuff" without forcing a placeholder pattern.
// Always renders 4 cells in a 2x2 mosaic. Filled cells show a real
// SlideThumb; empty cells show their slot number as "<n>/4" so a
// half-full collection still reads as a deliberate composition rather
// than a half-broken thumbnail. The cells meet edge-to-edge; the
// card's outer rounded-2xl + overflow:hidden clips the four outer
// corners.
function CollectionPreview({ collection }: { collection: CollectionRow }) {
  const posts = collection.recent_posts ?? []
  const cells = [posts[0], posts[1], posts[2], posts[3]]
  return (
    <div
      className="w-full h-full grid"
      style={{
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
      }}
    >
      {cells.map((post, i) => (
        <div
          key={post?.id ?? `empty-${i}`}
          className="overflow-hidden"
          style={{ background: 'var(--nw-admin-surface-inner)' }}
        >
          {post ? (
            <SlideThumb post={post} />
          ) : (
            <EmptySlot index={i + 1} />
          )}
        </div>
      ))}
    </div>
  )
}

// Tabular numbers (font-feature-settings: "tnum") so the slash and
// digits stay aligned; each unfilled slot reads like a counter ticking
// toward four.
function EmptySlot({ index }: { index: number }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        color: 'var(--nw-admin-surface-muted-soft)',
        fontFeatureSettings: '"tnum"',
      }}
    >
      <span className="text-sm font-medium">{index}/4</span>
    </div>
  )
}

function CollectionCard({
  collection,
  onRename,
  onDelete,
}: {
  collection: CollectionRow
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <div
      className="rounded-3xl flex flex-col"
      style={{
        background: 'var(--nw-admin-surface-outer)',
        border: '1px solid var(--nw-admin-surface-border)',
        padding: 10,
      }}
    >
      <Link href={`/collections/${collection.id}`} className="block">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            aspectRatio: '4 / 5',
            background: 'var(--nw-admin-surface-inner)',
          }}
        >
          <CollectionPreview collection={collection} />
        </div>
        <div className="pt-3 pb-2 px-1">
          <p
            className="text-sm font-medium truncate"
            style={{ color: 'var(--nw-admin-surface-fg)' }}
          >
            {collection.name}
          </p>
          <p
            className="text-[11px]"
            style={{ color: 'var(--nw-admin-surface-muted)' }}
          >
            {collection.post_count} {collection.post_count === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </Link>

      <div className="flex gap-1.5 pt-1">
        <button
          onClick={onRename}
          title="Rename collection"
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] rounded-full transition-colors"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-surface-border)',
            color: 'var(--nw-admin-surface-fg)',
            height: 34,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--nw-admin-surface-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--nw-admin-surface-inner)'
          }}
        >
          Rename
        </button>
        <button
          onClick={onDelete}
          title="Delete collection"
          aria-label="Delete"
          className="shrink-0 inline-flex items-center justify-center rounded-full transition-colors"
          style={{
            width: 34,
            height: 34,
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-surface-border)',
            color: 'var(--nw-admin-danger)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--nw-admin-danger-bg)'
            e.currentTarget.style.borderColor = 'var(--nw-admin-danger)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--nw-admin-surface-inner)'
            e.currentTarget.style.borderColor = 'var(--nw-admin-surface-border)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
