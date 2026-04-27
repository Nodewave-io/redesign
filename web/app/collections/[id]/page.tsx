'use client'

// Posts inside a single collection. Same grid the original home page
// rendered, scoped to one collection_id and topped with a "Collections /
// <name>" breadcrumb so it feels like a drilled-in view rather than a
// duplicate page.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/sidebar'
import { postToDbSlides, createEmptyPost, type Layer, type Slide } from '@/app/_lib/types'
import { SlideThumb } from '@/app/_components/slide-thumb'

type PostRow = {
  id: string
  title: string
  page_count: number
  theme: 'dark' | 'light'
  thumbnail_url: string | null
  updated_at: string
  collection_id: string
  slides: { slides: Slide[]; layers: Layer[] } | null
}

type Collection = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export default function CollectionPostsPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const collectionId = params.id
  const [user, setUser] = useState<unknown>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [collection, setCollection] = useState<Collection | null>(null)
  const [posts, setPosts] = useState<PostRow[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [renaming, setRenaming] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthLoading(false)
    })()
  }, [])

  const load = async () => {
    const [colRes, postsRes] = await Promise.all([
      fetch(`/api/collections/${collectionId}`),
      fetch(`/api/posts?collection_id=${encodeURIComponent(collectionId)}`),
    ])
    if (!colRes.ok) {
      setCollection(null)
      setPosts([])
      return
    }
    setCollection((await colRes.json()) as Collection)
    setPosts((await postsRes.json()) as PostRow[])
  }
  useEffect(() => {
    if (user) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, collectionId])

  const onDownload = async (post: PostRow) => {
    setDownloadingId(post.id)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/media/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ postId: post.id }),
      })
      if (!res.ok) throw new Error(await res.text())
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${post.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'post'}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert('Download failed: ' + msg)
    } finally {
      setDownloadingId(null)
    }
  }

  const onCreate = async () => {
    setCreating(true)
    try {
      const empty = createEmptyPost(3, 'dark')
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection_id: collectionId,
          title: empty.title,
          page_count: empty.page_count,
          aspect_ratio: empty.aspect_ratio,
          theme: empty.theme,
          slides: postToDbSlides({ slides: empty.slides, layers: empty.layers }),
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const { id } = (await res.json()) as { id: string }
      router.push(`/edit/${id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert('Create failed: ' + msg)
    } finally {
      // Reset even on success so the button isn't stuck if router.push
      // silently fails or the user navigates back to this page.
      setCreating(false)
    }
  }

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Delete failed: ' + (await res.text()))
      return
    }
    setPosts((p) => p?.filter((x) => x.id !== id) ?? null)
  }

  const onRenameCollection = async () => {
    if (!collection) return
    const next = window.prompt('Rename collection', collection.name)?.trim()
    if (!next || next === collection.name) return
    setRenaming(true)
    try {
      const res = await fetch(`/api/collections/${collection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: next }),
      })
      if (!res.ok) throw new Error(await res.text())
      setCollection((await res.json()) as Collection)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      alert('Rename failed: ' + msg)
    } finally {
      setRenaming(false)
    }
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
            {/* Breadcrumb on one line, both segments same size. The
                active segment (the collection name) is orange so it
                visually claims focus; the path prefix uses the page
                foreground (dark, full opacity) to match the palette.
                relative + z-10 keeps the title above the post grid in
                the document stacking order so descenders (like the g
                tail in "Redesign") never visually collide with cards
                below. The button uses overflow-x-hidden + leading + pb
                rather than `truncate` so descenders aren't clipped. */}
            <h1 className="relative z-10 flex items-baseline gap-2 min-w-0 text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15] pb-1">
              <Link
                href="/"
                className="shrink-0"
                style={{ color: 'var(--nw-admin-fg)' }}
              >
                Collections /
              </Link>
              <button
                onClick={onRenameCollection}
                disabled={!collection || renaming}
                className="text-left whitespace-nowrap text-ellipsis"
                style={{
                  color: 'var(--nw-admin-primary)',
                  overflowX: 'clip',
                  overflowY: 'visible',
                }}
                title="Click to rename"
              >
                {collection?.name ?? 'Loading…'}
              </button>
            </h1>
            <PrimaryButton onClick={onCreate} disabled={creating || !collection}>
              {creating ? 'Creating…' : 'New post'}
            </PrimaryButton>
          </div>

          {posts == null ? (
            <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>
              Loading posts…
            </p>
          ) : posts.length === 0 ? (
            <div>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: 'var(--nw-admin-muted)' }}
              >
                No posts in this collection yet. Start one manually, or ask Claude to build one.
              </p>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
              >
                <EmptyPostCard onClick={onCreate} disabled={creating} />
              </div>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
            >
              {posts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  downloading={downloadingId === p.id}
                  onDownload={() => onDownload(p)}
                  onDelete={() => onDelete(p.id, p.title)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function EmptyPostCard({
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
          Click to create your first post
        </p>
        <p className="text-[11px]" style={{ color: GREY }}>
          or ask Claude to build one
        </p>
      </div>
    </button>
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

function PostCard({
  post,
  downloading,
  onDownload,
  onDelete,
}: {
  post: PostRow
  downloading: boolean
  onDownload: () => void
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
      <Link href={`/edit/${post.id}`} className="block">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ aspectRatio: '4 / 5' }}
        >
          <SlideThumb post={post} />
        </div>
        <div className="pt-3 pb-2 px-1">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--nw-admin-surface-fg)' }}>
            {post.title}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--nw-admin-surface-muted)' }}>
            {post.page_count} slides · edited {relative(post.updated_at)}
          </p>
        </div>
      </Link>

      <div className="flex gap-1.5 pt-1">
        <button
          onClick={onDownload}
          disabled={downloading}
          title="Download as zip of PNGs"
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] rounded-full transition-colors disabled:opacity-50"
          style={{
            background: 'var(--nw-admin-surface-inner)',
            border: '1px solid var(--nw-admin-surface-border)',
            color: 'var(--nw-admin-surface-fg)',
            height: 34,
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-surface-hover)'
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-surface-inner)'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
          </svg>
          {downloading ? 'Exporting…' : 'Download'}
        </button>
        <button
          onClick={onDelete}
          title="Delete this post"
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

function relative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 60_000) return 'just now'
  if (ms < 3600_000) return `${Math.floor(ms / 60_000)}m ago`
  if (ms < 86_400_000) return `${Math.floor(ms / 3600_000)}h ago`
  if (ms < 7 * 86_400_000) return `${Math.floor(ms / 86_400_000)}d ago`
  return new Date(iso).toLocaleDateString()
}
