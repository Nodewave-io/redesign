'use client'

// Media overview — grid of all saved posts. Clicking a post navigates
// to its editor at /edit/[id]. Clicking "Media" in the
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
      // Local single-user mode — auth shim always returns our stub user.
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
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
      router.push(`/edit/${data.id}`)
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
    // Mirrors the Assets page layout so header spacing + main padding +
    // fluid grid feel identical between the two. Any cross-page chrome
    // changes should land in both files in lockstep.
    <div data-admin className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-[252px] flex flex-col">
        <div className="px-6 py-10 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: 'var(--nw-admin-fg)' }}>
              Posts
            </h1>
            {/* Asset library lives in the sidebar now; the top-right slot
                is just the primary "New post" CTA. */}
            <PrimaryButton onClick={onCreate} disabled={creating}>
              {creating ? 'Creating…' : 'New post'}
            </PrimaryButton>
          </div>

          {posts == null ? (
            <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>
              Loading posts…
            </p>
          ) : posts.length === 0 ? (
            // Empty state: a dashed placeholder card sits in the grid
            // footprint where a real post would live. Clicking the
            // card creates a new post — same action as the header CTA
            // but anchored visually so the page doesn't feel empty.
            <div>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: 'var(--nw-admin-muted)' }}
              >
                No posts yet. Start one manually, or ask Claude to build one.
              </p>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
              >
                <EmptyPostCard onClick={onCreate} disabled={creating} />
              </div>
            </div>
          ) : (
            // Fluid grid — same pattern as Assets: snap into as many
            // 220px columns as fit. Keeps cards uniform on any width
            // rather than stretching at big sizes.
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

// Dashed placeholder card used in the empty state. Shares the outer
// shape (rounded-3xl + 10px padding + 4:5 inner) with PostCard so it
// slots into the same grid cell size without jitter. Click-to-create
// keeps the surface interactive, not decorative.
function EmptyPostCard({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  // Single grey for every stroke + text in the placeholder so the
  // inside of the card reads as one quiet ghosted shape. The outer
  // frame matches a real PostCard (same white bg, same solid border),
  // only the image slot stays dashed + transparent.
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
          // Image slot stays "invisible" — no fill, just a dashed
          // outline hinting at where the slide thumbnail will appear
          // once the post exists.
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

// Primary action pill shared by the header CTA and the empty state.
// Matches the Assets upload button (same height, padding, icon sizing)
// so the two pages feel identical at a glance.
function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  // Dimensions match the landing's install pill
  // (min-h-[52px] + px-5/6 py-3/3.5) so the editor's primary CTA reads
  // as the same button family as the hero button users clicked to
  // install. Keeps the two surfaces feeling like one product.
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
    // Dark polaroid-style frame on the cream page. The inner slide
    // preview keeps its own theme so light/dark slides render true;
    // every text + button around it uses the `surface-*` tokens.
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
          <FirstSlidePreview post={post} />
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
        {/* Secondary buttons living on the dark card. Background is the
            inner surface token (slightly lighter than outer), text is
            cream, hover bumps to surface-hover. */}
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
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'
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
