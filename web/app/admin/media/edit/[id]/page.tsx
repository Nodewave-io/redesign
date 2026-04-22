'use client'

// The editor, now scoped to a specific post id via the route. The
// /admin/media index is an overview of all posts — clicking one lands
// here, closing it (clicking Media in the sidebar) goes back.

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/sidebar'
import { editor, useEditorState } from '../../_lib/store'
import type { SavePayload, SaveResult } from '../../_lib/store'
import { Canvas } from '../../_components/Canvas'
import { LeftPanel } from '../../_components/LeftPanel'
import { RightPanel } from '../../_components/RightPanel'
import { postFromRow, postToDbSlides, MediaPostRow } from '../../_lib/types'

export default function MediaEditorPage() {
  const params = useParams<{ id: string }>()
  const postId = params?.id
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { post, selectedLayerId } = useEditorState()

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/admin')
      else setUser(user)
      setAuthLoading(false)
    })()
  }, [router])

  // Load the post (or surface not-found) on mount / id change.
  useEffect(() => {
    if (!postId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setNotFound(false)
      const { data, error } = await supabase
        .from('media_posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle()
      if (cancelled) return
      if (error || !data) {
        setNotFound(true)
      } else {
        editor.loadPost(postFromRow(data as MediaPostRow))
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [postId])

  // Register the autosave saver. Same saver as before; concurrency via
  // expected_updated_at. On 409 (row moved), surface a clear error so
  // the user reloads.
  useEffect(() => {
    const saver = async (payload: SavePayload): Promise<SaveResult> => {
      const body = {
        title: payload.title,
        page_count: payload.page_count,
        aspect_ratio: payload.aspect_ratio,
        theme: payload.theme,
        slides: postToDbSlides({ slides: payload.slides, layers: payload.layers }),
      }
      if (payload.id == null) {
        const { data, error } = await supabase
          .from('media_posts')
          .insert(body)
          .select('id, updated_at')
          .single()
        if (error) throw error
        return { id: data.id as string, updated_at: data.updated_at as string }
      }
      let query = supabase.from('media_posts').update(body).eq('id', payload.id)
      if (payload.expected_updated_at) {
        query = query.eq('updated_at', payload.expected_updated_at)
      }
      const { data, error } = await query.select('id, updated_at').maybeSingle()
      if (error) throw error
      if (!data) {
        throw new Error(
          'This post was modified somewhere else (Claude or another tab). Reload the post to see the latest version.',
        )
      }
      return { id: data.id as string, updated_at: data.updated_at as string }
    }
    editor.registerSaver(saver)
    return () => editor.registerSaver(null)
  }, [])

  // Keyboard shortcuts — Delete/Backspace removes selected, Esc
  // deselects, Cmd+Z undoes, Cmd+Shift+Z / Cmd+Y redoes, Cmd+S forces
  // an immediate save flush.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement
      const typing =
        active &&
        (active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          (active as HTMLElement).isContentEditable)
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void editor.flushNow()
        return
      }
      if (meta && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) editor.redo()
        else editor.undo()
        return
      }
      if (meta && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        editor.redo()
        return
      }
      if (typing) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
        e.preventDefault()
        editor.removeLayer(selectedLayerId)
      }
      if (e.key === 'Escape') editor.select(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedLayerId])

  // Bump LeftPanel's asset list when the post id changes (not usually
  // needed, but harmless).
  useEffect(() => {
    setRefreshKey((k) => k + 1)
  }, [post.id])

  const onExport = async () => {
    if (!post.id) return
    setExporting(true)
    try {
      await editor.flushNow()
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
      alert('Export failed: ' + (err?.message ?? err))
    } finally {
      setExporting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div data-admin className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>Loading…</p>
      </div>
    )
  }
  if (!user) return null
  if (notFound) {
    return (
      <div data-admin className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm" style={{ color: 'var(--nw-admin-muted)' }}>Post not found.</p>
        <button
          onClick={() => router.push('/admin/media')}
          className="text-sm underline"
          style={{ color: 'var(--nw-admin-primary)' }}
        >
          Back to posts
        </button>
      </div>
    )
  }

  return (
    <div data-admin className="h-screen flex overflow-hidden">
      <AdminSidebar extra={<LeftPanel refreshKey={refreshKey} />} />

      <main className="flex-1 md:ml-[252px] flex flex-col min-w-0">
        <div className="flex-1 flex min-h-0 gap-4 p-4">
          <Canvas />
          <RightPanel exporting={exporting} onExport={onExport} />
        </div>
      </main>
    </div>
  )
}
