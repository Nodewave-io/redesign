'use client'

import { useSyncExternalStore } from 'react'
import {
  Layer,
  MediaPost,
  Slide,
  Theme,
  createEmptyPost,
  cryptoId,
} from './types'

// Distributive Omit so each variant of the discriminated Layer union
// keeps its own literal `kind` shape — plain `Omit<Layer, 'id'>`
// collapses to the intersection of common props which rejects
// variant-specific fields like `text` or `fill`.
type LayerInput = Layer extends infer L ? (L extends Layer ? Omit<L, 'id'> : never) : never

// Minimal in-memory store with a subscribe/notify pattern so hooks get
// automatic re-renders, without pulling in Zustand or Jotai. We only
// have one editor open at a time, so a module-level singleton is fine.

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

type EditorPost = Omit<MediaPost, 'id' | 'created_at' | 'thumbnail_url' | 'updated_at'> & {
  id: string | null
  /** Server-returned timestamp — the optimistic-concurrency token. */
  updated_at: string | null
}

type Snapshot = {
  title: string
  page_count: number
  theme: Theme
  slides: Slide[]
  layers: Layer[]
  selectedLayerId: string | null
}

type EditorState = {
  post: EditorPost
  selectedLayerId: string | null
  /** Viewport mode — stitched strip vs single-slide carousel. */
  viewMode: 'strip' | 'carousel'
  /** For carousel mode: which slide is showing. */
  currentSlide: number
  /** Dirty = unsaved changes. Cleared by a successful auto-save. */
  dirty: boolean
  /** Save lifecycle for the header indicator. */
  saveState: SaveState
  /** Timestamp (ms) of the last successful save — drives "Saved · 12s ago". */
  lastSavedAt: number | null
  /** Last save error message (cleared on next success). */
  saveError: string | null
}

/** What the saver receives — everything needed to write a row plus
 *  the optimistic-concurrency token. */
export type SavePayload = {
  id: string | null
  title: string
  page_count: number
  aspect_ratio: string
  theme: Theme
  slides: Slide[]
  layers: Layer[]
  expected_updated_at: string | null
}
export type SaveResult = { id: string; updated_at: string }
export type Saver = (payload: SavePayload) => Promise<SaveResult>

// ─── Singleton state ────────────────────────────────────────────────

function createInitial(): EditorState {
  const empty = createEmptyPost(3, 'dark')
  return {
    post: { id: null, updated_at: null, ...empty },
    selectedLayerId: null,
    viewMode: 'strip',
    currentSlide: 0,
    dirty: false,
    saveState: 'idle',
    lastSavedAt: null,
    saveError: null,
  }
}

let state: EditorState = createInitial()
const listeners = new Set<() => void>()

// Auto-save + undo plumbing. These live outside the state object
// because they're implementation detail — undo depth and in-flight
// status don't need to trigger re-renders when they change.
const UNDO_CAP = 50
const AUTOSAVE_DEBOUNCE_MS = 2000
let undoStack: Snapshot[] = []
let redoStack: Snapshot[] = []
let saver: Saver | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null
let savingInflight = false
let pendingWhileSaving = false

function emit() {
  for (const l of listeners) l()
}

function snapshot(s: EditorState): Snapshot {
  return {
    title: s.post.title,
    page_count: s.post.page_count,
    theme: s.post.theme,
    slides: s.post.slides,
    layers: s.post.layers,
    selectedLayerId: s.selectedLayerId,
  }
}

/** Apply a mutation and mark the post dirty. Captures an undo
 *  snapshot before the mutation, clears redo history (standard
 *  behavior — a new edit after an undo loses the future). */
function set(mutator: (s: EditorState) => void) {
  const before = snapshot(state)
  undoStack.push(before)
  if (undoStack.length > UNDO_CAP) undoStack.shift()
  redoStack = []
  // Shallow clone root so React bails out correctly.
  state = { ...state, post: { ...state.post } }
  mutator(state)
  state.dirty = true
  // A dirty edit invalidates any "Saved just now" status until the
  // next successful flush.
  if (state.saveState === 'saved') state.saveState = 'idle'
  scheduleAutoSave()
  emit()
}

function reset(post: EditorPost) {
  state = {
    post,
    selectedLayerId: null,
    viewMode: state.viewMode,
    currentSlide: 0,
    dirty: false,
    saveState: 'idle',
    lastSavedAt: null,
    saveError: null,
  }
  undoStack = []
  redoStack = []
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
  emit()
}

function applySnapshot(snap: Snapshot) {
  state = {
    ...state,
    post: {
      ...state.post,
      title: snap.title,
      page_count: snap.page_count,
      theme: snap.theme,
      slides: snap.slides,
      layers: snap.layers,
    },
    selectedLayerId: snap.selectedLayerId,
    dirty: true,
    saveState: 'idle',
  }
  if (state.currentSlide >= state.post.slides.length) {
    state.currentSlide = Math.max(0, state.post.slides.length - 1)
  }
  scheduleAutoSave()
  emit()
}

// ─── Auto-save ──────────────────────────────────────────────────────

function scheduleAutoSave() {
  if (!saver) return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = null
    void flushAutoSave()
  }, AUTOSAVE_DEBOUNCE_MS)
}

async function flushAutoSave() {
  if (!saver || !state.dirty) return
  if (savingInflight) {
    // Another save already in flight — remember that more edits came
    // in so we re-flush after it completes.
    pendingWhileSaving = true
    return
  }
  savingInflight = true
  const snapshotPost = state.post
  state = { ...state, saveState: 'saving', saveError: null }
  emit()

  try {
    const result = await saver({
      id: snapshotPost.id,
      title: snapshotPost.title,
      page_count: snapshotPost.page_count,
      aspect_ratio: snapshotPost.aspect_ratio,
      theme: snapshotPost.theme,
      slides: snapshotPost.slides,
      layers: snapshotPost.layers,
      expected_updated_at: snapshotPost.updated_at,
    })
    // Post state may have drifted further while the save was in
    // flight. Only clear `dirty` if no new edits landed — otherwise
    // re-flush once this pass completes.
    const editedDuringSave = state.post !== snapshotPost && state.dirty
    state = {
      ...state,
      post: {
        ...state.post,
        id: result.id,
        updated_at: result.updated_at,
      },
      dirty: editedDuringSave,
      saveState: editedDuringSave ? 'idle' : 'saved',
      lastSavedAt: Date.now(),
      saveError: null,
    }
    emit()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    state = {
      ...state,
      saveState: 'error',
      saveError: msg,
    }
    emit()
  } finally {
    savingInflight = false
    if (pendingWhileSaving) {
      pendingWhileSaving = false
      scheduleAutoSave()
    }
  }
}

// ─── Undo / redo ────────────────────────────────────────────────────

function undo() {
  const prev = undoStack.pop()
  if (!prev) return
  redoStack.push(snapshot(state))
  applySnapshot(prev)
}

function redo() {
  const next = redoStack.pop()
  if (!next) return
  undoStack.push(snapshot(state))
  applySnapshot(next)
}

// ─── Public actions ─────────────────────────────────────────────────

export const editor = {
  get state() {
    return state
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  /** Register the function that actually persists the post. Called
   *  once by page.tsx. Without this, edits accumulate locally but
   *  auto-save is a no-op. */
  registerSaver(fn: Saver | null) {
    saver = fn
  },
  /** Force an immediate flush. Called by Cmd+S or the Save button. */
  async flushNow() {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    await flushAutoSave()
  },
  loadPost(post: MediaPost) {
    reset({
      id: post.id,
      updated_at: post.updated_at,
      title: post.title,
      page_count: post.page_count,
      aspect_ratio: post.aspect_ratio,
      theme: post.theme,
      slides: post.slides,
      layers: post.layers,
    })
  },
  newPost(pageCount = 3, theme: Theme = 'dark') {
    reset({ id: null, updated_at: null, ...createEmptyPost(pageCount, theme) })
  },
  setId(id: string) {
    state = { ...state, post: { ...state.post, id } }
    emit()
  },
  setTitle(title: string) {
    set((s) => {
      s.post.title = title
    })
  },
  setTheme(theme: Theme) {
    set((s) => {
      s.post.theme = theme
    })
  },
  setPageCount(n: number) {
    set((s) => {
      const current = s.post.slides.length
      if (n > current) {
        const add: Slide[] = Array.from({ length: n - current }, () => ({
          id: cryptoId(),
        }))
        s.post.slides = [...s.post.slides, ...add]
      } else if (n < current) {
        const removed = s.post.slides.slice(n)
        const removedIndexes = new Set(removed.map((_, i) => i + n))
        s.post.layers = s.post.layers.filter((l) => !removedIndexes.has(l.slideIndex))
        s.post.slides = s.post.slides.slice(0, n)
      }
      s.post.page_count = s.post.slides.length
      if (s.currentSlide >= s.post.slides.length) {
        s.currentSlide = s.post.slides.length - 1
      }
    })
  },
  setCurrentSlide(i: number) {
    state = {
      ...state,
      currentSlide: Math.max(0, Math.min(state.post.slides.length - 1, i)),
    }
    emit()
  },
  setViewMode(m: EditorState['viewMode']) {
    state = { ...state, viewMode: m }
    emit()
  },
  select(id: string | null) {
    state = { ...state, selectedLayerId: id }
    emit()
  },
  addLayer(layer: LayerInput): Layer {
    const full = { ...(layer as any), id: cryptoId() } as Layer
    set((s) => {
      s.post.layers = [...s.post.layers, full]
      s.selectedLayerId = full.id
    })
    return full
  },
  updateLayer(id: string, patch: Partial<Layer>) {
    set((s) => {
      s.post.layers = s.post.layers.map((l) =>
        l.id === id ? ({ ...l, ...patch } as Layer) : l,
      )
    })
  },
  removeLayer(id: string) {
    set((s) => {
      s.post.layers = s.post.layers.filter((l) => l.id !== id)
      if (s.selectedLayerId === id) s.selectedLayerId = null
    })
  },
  duplicateLayer(id: string) {
    const src = state.post.layers.find((l) => l.id === id)
    if (!src) return
    const copy = { ...src, id: cryptoId(), x: src.x + 24, y: src.y + 24 } as Layer
    set((s) => {
      s.post.layers = [...s.post.layers, copy]
    })
  },
  moveLayerZ(id: string, direction: 'up' | 'down' | 'top' | 'bottom') {
    set((s) => {
      const idx = s.post.layers.findIndex((l) => l.id === id)
      if (idx === -1) return
      const arr = [...s.post.layers]
      const [layer] = arr.splice(idx, 1)
      if (direction === 'up') arr.splice(Math.min(idx + 1, arr.length), 0, layer)
      else if (direction === 'down') arr.splice(Math.max(idx - 1, 0), 0, layer)
      else if (direction === 'top') arr.push(layer)
      else arr.unshift(layer)
      s.post.layers = arr
    })
  },
  undo,
  redo,
  /** Whether undo / redo are available — drives button enabled states. */
  canUndo() {
    return undoStack.length > 0
  },
  canRedo() {
    return redoStack.length > 0
  },
}

export function useEditor<T>(selector: (s: EditorState) => T): T {
  return useSyncExternalStore(
    editor.subscribe,
    () => selector(state),
    () => selector(state),
  )
}

export function useEditorState(): EditorState {
  return useSyncExternalStore(editor.subscribe, () => state, () => state)
}
