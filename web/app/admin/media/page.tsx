'use client'

// Media overview — grid of all saved posts. Clicking a post navigates
// to its editor at /admin/media/edit/[id]. Clicking "Media" in the
// sidebar from inside the editor brings you back here.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/sidebar'
import { CANVAS, postToDbSlides, createEmptyPost, type Layer, type Slide } from './_lib/types'
import { LayerNode, SlideBackground } from './_lib/render'

type PostRow = {
  id: string
  title: string
  page_count: number
  theme: 'dark' | 'light'
  thumbnail_url: string | null
  updated_at: string
  slides: { slides: Slide[]; layers: Layer[] } | null
}

export default function MediaOverviewPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [posts, setPosts] = useState<PostRow[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/admin')
      else setUser(user)
      setAuthLoading(false)
    })()
  }, [router])

  const load = async () => {
    const { data } = await supabase
      .from('media_posts')
      .select('id, title, page_count, theme, thumbnail_url, updated_at, slides')
      .order('updated_at', { ascending: false })
    setPosts((data as PostRow[]) ?? [])
  }
  useEffect(() => {
    if (user) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
    } catch (err: any) {
      alert('Download failed: ' + (err?.message ?? err))
    } finally {
      setDownloadingId(null)
    }
  }

  const onCreate = async () => {
    setCreating(true)
    try {
      const empty = createEmptyPost(3, 'dark')
      const { data, error } = await supabase
        .from('media_posts')
        .insert({
          title: empty.title,
          page_count: empty.page_count,
          aspect_ratio: empty.aspect_ratio,
          theme: empty.theme,
          slides: postToDbSlides({ slides: empty.slides, layers: empty.layers }),
        })
        .select('id')
        .single()
      if (error) throw error
      router.push(`/admin/media/edit/${data.id}`)
    } catch (err: any) {
      alert('Create failed: ' + (err?.message ?? err))
      setCreating(false)
    }
  }

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return
    const { error } = await supabase.from('media_posts').delete().eq('id', id)
    if (error) {
      alert('Delete failed: ' + error.message)
      return
    }
    setPosts((p) => p?.filter((x) => x.id !== id) ?? null)
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
    <div data-admin className="min-h-screen">
      <AdminSidebar />

      <main className="md:ml-[252px] p-4 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--nw-admin-fg)' }}>
            Media
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/media/assets"
              className="inline-flex items-center text-sm rounded-full px-4 transition-colors"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(15,18,17,0.12)',
                color: '#0F1211',
                height: 44,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,18,17,0.03)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF' }}
            >
              Asset library
            </Link>
            <button
              onClick={onCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 transition-colors disabled:opacity-50"
              style={{
                background: 'var(--nw-admin-primary)',
                color: '#FFFFFF',
                height: 44,
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary-hover)'
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) e.currentTarget.style.background = 'var(--nw-admin-primary)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {creating ? 'Creating…' : 'New post'}
            </button>
          </div>
        </header>

        {posts == null ? (
          <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>Loading posts…</p>
        ) : posts.length === 0 ? (
          <div
            className="rounded-3xl p-12 flex flex-col items-center justify-center text-center"
            style={{
              background: 'var(--nw-admin-surface-outer)',
              border: '1px solid var(--nw-admin-border-outer)',
            }}
          >
            <p className="text-base mb-1" style={{ color: 'var(--nw-admin-fg)' }}>
              No posts yet.
            </p>
            <p className="text-sm mb-5" style={{ color: 'var(--nw-admin-muted)' }}>
              Create your first media post or ask Claude to build one for you.
            </p>
            <button
              onClick={onCreate}
              disabled={creating}
              className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 disabled:opacity-50"
              style={{ background: 'var(--nw-admin-primary)', color: '#FFFFFF', height: 44 }}
            >
              {creating ? 'Creating…' : 'New post'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
      </main>
    </div>
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
        border: '1px solid var(--nw-admin-border-outer)',
        padding: 10,
      }}
    >
      <Link href={`/admin/media/edit/${post.id}`} className="block">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            // Match the slide theme's own background so any sub-pixel
            // gap between the scaled inner canvas and the container
            // edge is invisible instead of showing as a stray line.
            background: post.theme === 'dark' ? '#0A0A0A' : '#FAFAFA',
            aspectRatio: '4 / 5',
          }}
        >
          <FirstSlidePreview post={post} />
        </div>
        <div className="pt-3 pb-2 px-1">
          <p className="text-sm font-medium truncate" style={{ color: 'var(--nw-admin-fg)' }}>
            {post.title}
          </p>
          <p className="text-[11px]" style={{ color: 'var(--nw-admin-muted)' }}>
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
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#0F1211',
            height: 34,
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.background = 'rgba(15,18,17,0.03)'
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) e.currentTarget.style.background = '#FFFFFF'
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
            background: '#FFFFFF',
            border: '1px solid rgba(15,18,17,0.12)',
            color: '#DC2626',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.06)'
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF'
            e.currentTarget.style.borderColor = 'rgba(15,18,17,0.12)'
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

// Live preview of the post's first slide — scaled to fit the card.
// Uses the same LayerNode the editor + export pipeline use, so the
// thumbnail stays in sync with what you see on the canvas. Falls back
// to a muted "Empty" label when there are no layers yet.
function FirstSlidePreview({ post }: { post: PostRow }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => {
      // Use max(width/W, height/H) so the scaled inner always covers
      // the container. CSS `aspect-ratio: 4/5` + transform: scale by
      // width alone can round to a sub-pixel gap at the bottom that
      // exposes the container background. overflow:hidden clips any
      // excess from the chosen-max side.
      const ratioW = el.clientWidth / CANVAS.W
      const ratioH = el.clientHeight / CANVAS.H
      // Tiny overshoot so even at the browser's worst sub-pixel
      // rounding the inner canvas covers the full container — the
      // container's overflow:hidden clips the excess row/column.
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
  // Anything that lives on slide 0 or bleeds in via `spans`.
  const onFirst = layers.filter((l) => {
    const span = l.spans ?? 1
    return l.slideIndex === 0 && 0 < span + l.slideIndex
      ? true
      : l.slideIndex <= 0 && 0 < l.slideIndex + span
  })

  const empty = !slide0 || layers.length === 0

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full overflow-hidden"
      style={{ pointerEvents: 'none' }}
    >
      {/* Scaled inner canvas. We render at actual 1000×1250 units and
          downscale with a transform so layer coordinates stay truthful
          no matter the card's pixel width. */}
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
          {onFirst.map((layer) => {
            const adjusted = {
              ...layer,
              x: layer.x + layer.slideIndex * CANVAS.W * 0, // stays on slide 0 coords
            }
            return (
              <div
                key={layer.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: layer.z ?? 0,
                }}
              >
                <LayerNode layer={adjusted} theme={post.theme} />
              </div>
            )
          })}
        </div>
      )}
      {empty && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            className="text-xs"
            style={{
              color:
                post.theme === 'dark'
                  ? 'rgba(245,245,245,0.4)'
                  : 'rgba(15,18,17,0.35)',
            }}
          >
            Empty
          </p>
        </div>
      )}
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
