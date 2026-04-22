// Batch helper — apply many post mutations atomically. One snapshot,
// one DB write, one updated_at check. Reduces token + round-trip cost
// vs. issuing N separate write tools.
//
// Operations are processed in order against an in-memory working copy.
// Each add_layer can produce (or accept) a uuid so later ops in the
// same batch can reference the new layer.

import { z } from 'zod'
import { createRevision, getPost, updatePost } from '../db/repo.js'
import { CANVAS } from '../db/types.js'
import type { Layer, Slide } from '../db/types.js'
import { layerInput, layerPatch } from './schemas.js'
import { cryptoId } from './write-helpers.js'

// ─── Operation schemas ─────────────────────────────────────────────

export const batchOp = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('add_layer'),
    layer: layerInput,
    // Optional client-minted UUID. If provided, later ops in the same
    // batch can reference the new layer by this id. If omitted, the
    // server mints one and returns it in addedLayerIds.
    id: z.string().uuid().optional(),
  }),
  z.object({
    type: z.literal('update_layer'),
    layerId: z.string().uuid(),
    patch: layerPatch,
  }),
  z.object({ type: z.literal('remove_layer'), layerId: z.string().uuid() }),
  z.object({
    type: z.literal('set_code_source'),
    layerId: z.string().uuid(),
    source: z.string().max(100_000),
  }),
  z.object({
    type: z.literal('move_layer_z'),
    layerId: z.string().uuid(),
    direction: z.enum(['up', 'down', 'top', 'bottom']),
  }),
  z.object({
    type: z.literal('set_slide_background'),
    slideIndex: z.number().int().min(0),
    background: z.string().nullable(),
  }),
  z.object({
    type: z.literal('align'),
    layerIds: z.array(z.string().uuid()).min(2),
    to: z.enum(['left', 'right', 'top', 'bottom', 'centerX', 'centerY']),
  }),
  z.object({
    type: z.literal('distribute'),
    layerIds: z.array(z.string().uuid()).min(3),
    axis: z.enum(['horizontal', 'vertical']),
    mode: z.enum(['gaps', 'centers']).optional(),
  }),
])

export type BatchOp = z.infer<typeof batchOp>

export type BatchResult = {
  id: string
  updated_at: string
  // Parallel array to ops: for each add_layer op, the new layerId.
  // null for non-add ops. Lets callers match adds to their new ids.
  addedLayerIds: (string | null)[]
}

// ─── Apply ─────────────────────────────────────────────────────────

export function applyBatch(
  postId: string,
  expectedUpdatedAt: string,
  ops: BatchOp[],
  note: string,
): BatchResult {
  if (ops.length === 0) {
    throw new Error('batch requires at least one operation')
  }

  const current = getPost(postId)
  if (current.updated_at !== expectedUpdatedAt) {
    throw new Error(
      `stale: expected_updated_at ${expectedUpdatedAt} does not match current ${current.updated_at}. Re-fetch with media_get_post and retry.`,
    )
  }

  createRevision(current.id, current, 'mcp', note)

  let slides: Slide[] = current.slides
  let layers: Layer[] = current.layers
  const addedLayerIds: (string | null)[] = []

  for (const op of ops) {
    switch (op.type) {
      case 'add_layer': {
        const id = op.id ?? cryptoId()
        if (op.layer.slideIndex >= slides.length || op.layer.slideIndex < 0) {
          throw new Error(
            `add_layer: slideIndex ${op.layer.slideIndex} out of range (post has ${slides.length} slides)`,
          )
        }
        if (layers.some((l) => l.id === id)) {
          throw new Error(`add_layer: id ${id} collides with an existing layer`)
        }
        layers = [...layers, { ...op.layer, id } as Layer]
        addedLayerIds.push(id)
        break
      }
      case 'update_layer': {
        const idx = layers.findIndex((l) => l.id === op.layerId)
        if (idx === -1) throw new Error(`update_layer: ${op.layerId} not found`)
        if (op.patch.slideIndex != null && op.patch.slideIndex >= slides.length) {
          throw new Error(
            `update_layer: slideIndex ${op.patch.slideIndex} out of range`,
          )
        }
        const next = [...layers]
        next[idx] = { ...next[idx], ...op.patch } as Layer
        layers = next
        addedLayerIds.push(null)
        break
      }
      case 'remove_layer': {
        const before = layers.length
        layers = layers.filter((l) => l.id !== op.layerId)
        if (layers.length === before) {
          throw new Error(`remove_layer: ${op.layerId} not found`)
        }
        addedLayerIds.push(null)
        break
      }
      case 'set_code_source': {
        const idx = layers.findIndex((l) => l.id === op.layerId)
        if (idx === -1) throw new Error(`set_code_source: ${op.layerId} not found`)
        if (layers[idx].kind !== 'code') {
          throw new Error(`set_code_source: ${op.layerId} is not a code layer`)
        }
        const next = [...layers]
        next[idx] = { ...next[idx], source: op.source } as Layer
        layers = next
        addedLayerIds.push(null)
        break
      }
      case 'move_layer_z': {
        const idx = layers.findIndex((l) => l.id === op.layerId)
        if (idx === -1) throw new Error(`move_layer_z: ${op.layerId} not found`)
        const next = [...layers]
        const [layer] = next.splice(idx, 1)
        if (op.direction === 'up') next.splice(Math.min(idx + 1, next.length), 0, layer)
        else if (op.direction === 'down') next.splice(Math.max(idx - 1, 0), 0, layer)
        else if (op.direction === 'top') next.push(layer)
        else next.unshift(layer)
        layers = next
        addedLayerIds.push(null)
        break
      }
      case 'set_slide_background': {
        if (op.slideIndex >= slides.length || op.slideIndex < 0) {
          throw new Error(
            `set_slide_background: slideIndex ${op.slideIndex} out of range`,
          )
        }
        slides = slides.map((s, i) =>
          i === op.slideIndex
            ? op.background == null
              ? { id: s.id }
              : { ...s, background: op.background }
            : s,
        )
        addedLayerIds.push(null)
        break
      }
      case 'align': {
        layers = applyAlign(layers, op.layerIds, op.to)
        addedLayerIds.push(null)
        break
      }
      case 'distribute': {
        layers = applyDistribute(layers, op.layerIds, op.axis, op.mode ?? 'gaps')
        addedLayerIds.push(null)
        break
      }
    }
  }

  const next = updatePost(postId, { slides, layers }, expectedUpdatedAt)
  return {
    id: next.id,
    updated_at: next.updated_at,
    addedLayerIds,
  }
}

// ─── Align / distribute math (also used by smart-align tools) ──────

export function applyAlign(
  layers: Layer[],
  layerIds: string[],
  to: 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY',
): Layer[] {
  const targets = layers.filter((l) => layerIds.includes(l.id))
  if (targets.length < 2) return layers
  let value: number
  switch (to) {
    case 'left':
      value = Math.min(...targets.map((l) => l.x))
      return layers.map((l) =>
        layerIds.includes(l.id) ? ({ ...l, x: value } as Layer) : l,
      )
    case 'right':
      value = Math.max(...targets.map((l) => l.x + l.w))
      return layers.map((l) =>
        layerIds.includes(l.id) ? ({ ...l, x: value - l.w } as Layer) : l,
      )
    case 'top':
      value = Math.min(...targets.map((l) => l.y))
      return layers.map((l) =>
        layerIds.includes(l.id) ? ({ ...l, y: value } as Layer) : l,
      )
    case 'bottom':
      value = Math.max(...targets.map((l) => l.y + l.h))
      return layers.map((l) =>
        layerIds.includes(l.id) ? ({ ...l, y: value - l.h } as Layer) : l,
      )
    case 'centerX': {
      const center =
        targets.reduce((sum, l) => sum + l.x + l.w / 2, 0) / targets.length
      return layers.map((l) =>
        layerIds.includes(l.id)
          ? ({ ...l, x: Math.round(center - l.w / 2) } as Layer)
          : l,
      )
    }
    case 'centerY': {
      const center =
        targets.reduce((sum, l) => sum + l.y + l.h / 2, 0) / targets.length
      return layers.map((l) =>
        layerIds.includes(l.id)
          ? ({ ...l, y: Math.round(center - l.h / 2) } as Layer)
          : l,
      )
    }
  }
}

export function applyDistribute(
  layers: Layer[],
  layerIds: string[],
  axis: 'horizontal' | 'vertical',
  mode: 'gaps' | 'centers',
): Layer[] {
  const targets = layers.filter((l) => layerIds.includes(l.id))
  if (targets.length < 3) return layers
  const sorted = [...targets].sort((a, b) =>
    axis === 'horizontal' ? a.x - b.x : a.y - b.y,
  )

  if (mode === 'centers') {
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const firstCenter =
      axis === 'horizontal' ? first.x + first.w / 2 : first.y + first.h / 2
    const lastCenter =
      axis === 'horizontal' ? last.x + last.w / 2 : last.y + last.h / 2
    const step = (lastCenter - firstCenter) / (sorted.length - 1)
    const updates = new Map<string, { x?: number; y?: number }>()
    sorted.forEach((l, i) => {
      const target = firstCenter + step * i
      if (axis === 'horizontal')
        updates.set(l.id, { x: Math.round(target - l.w / 2) })
      else updates.set(l.id, { y: Math.round(target - l.h / 2) })
    })
    return layers.map((l) => {
      const u = updates.get(l.id)
      return u ? ({ ...l, ...u } as Layer) : l
    })
  }

  // mode === 'gaps'
  const totalSpan =
    axis === 'horizontal'
      ? sorted[sorted.length - 1].x + sorted[sorted.length - 1].w - sorted[0].x
      : sorted[sorted.length - 1].y + sorted[sorted.length - 1].h - sorted[0].y
  const totalSize = sorted.reduce(
    (sum, l) => sum + (axis === 'horizontal' ? l.w : l.h),
    0,
  )
  const gap = (totalSpan - totalSize) / (sorted.length - 1)
  let cursor = axis === 'horizontal' ? sorted[0].x : sorted[0].y
  const updates = new Map<string, { x?: number; y?: number }>()
  sorted.forEach((l) => {
    if (axis === 'horizontal') updates.set(l.id, { x: Math.round(cursor) })
    else updates.set(l.id, { y: Math.round(cursor) })
    cursor += (axis === 'horizontal' ? l.w : l.h) + gap
  })
  return layers.map((l) => {
    const u = updates.get(l.id)
    return u ? ({ ...l, ...u } as Layer) : l
  })
}

// Helper shared with inspection tools.
export function isOnSlide(layer: Layer, slideIndex: number): boolean {
  const span = layer.spans ?? 1
  return layer.slideIndex <= slideIndex && slideIndex < layer.slideIndex + span
}

export { CANVAS }
