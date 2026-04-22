// Read-only layout introspection. These answer questions Claude would
// otherwise need a screenshot for: "are these three layers aligned?",
// "do any layers overlap on slide 2?", "is this text going to overflow?".
//
// All pure-data — no rendering. Cheap. Use these instead of
// media_screenshot whenever the answer is geometric.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { getPost } from '../../db/repo.js'
import type { Layer, MediaPost } from '../../db/types.js'
import { CANVAS } from '../../db/types.js'
import { isOnSlide } from '../batch.js'

// Tolerance (canvas units) for "aligned". 1px on a 1000-unit canvas is
// below mouse-edit precision so we accept up to ~3 units.
const ALIGN_TOLERANCE = 3

export function registerInspectTools(server: McpServer): void {
  server.registerTool(
    'media_check_alignment',
    {
      description:
        "Pairwise alignment check across layers. For each axis, returns groups that DO align within tolerance and the offsets of any that don't. Cheaper than a screenshot and gives exact deltas.",
      inputSchema: {
        id: z.string().uuid(),
        slideIndex: z.number().int().min(0).optional(),
        layerIds: z.array(z.string().uuid()).optional(),
        tolerance: z.number().min(0).max(50).optional(),
      },
    },
    withLogging(
      'media_check_alignment',
      async (args: {
        id: string
        slideIndex?: number
        layerIds?: string[]
        tolerance?: number
      }) => {
        const post = getPost(args.id)
        const tol = args.tolerance ?? ALIGN_TOLERANCE
        const subject = pickLayers(post, args.layerIds, args.slideIndex)
        if (subject.length < 2) {
          return textJson({ note: 'need at least 2 layers to compare', subject: subject.length })
        }
        const axes: Record<string, (l: Layer) => number> = {
          left: (l) => l.x,
          right: (l) => l.x + l.w,
          centerX: (l) => l.x + l.w / 2,
          top: (l) => l.y,
          bottom: (l) => l.y + l.h,
          centerY: (l) => l.y + l.h / 2,
        }
        const out: Record<
          string,
          { aligned: string[][]; outliers: { id: string; value: number }[] }
        > = {}
        for (const [name, get] of Object.entries(axes)) {
          const values = subject.map((l) => ({ id: l.id, v: get(l) }))
          const groups: string[][] = []
          const used = new Set<string>()
          for (const a of values) {
            if (used.has(a.id)) continue
            const group = [a.id]
            used.add(a.id)
            for (const b of values) {
              if (used.has(b.id)) continue
              if (Math.abs(a.v - b.v) <= tol) {
                group.push(b.id)
                used.add(b.id)
              }
            }
            if (group.length > 1) groups.push(group)
          }
          const groupedIds = new Set(groups.flat())
          const outliers = values
            .filter((v) => !groupedIds.has(v.id))
            .map((v) => ({ id: v.id, value: Math.round(v.v) }))
          out[name] = { aligned: groups, outliers }
        }
        return textJson({ tolerance: tol, axes: out })
      },
    ),
  )

  server.registerTool(
    'media_check_overlaps',
    {
      description:
        'Find layer pairs whose bounding boxes intersect on a slide. Returns the ids + overlap area. Useful for spotting unintentional collisions without rendering.',
      inputSchema: {
        id: z.string().uuid(),
        slideIndex: z.number().int().min(0).optional(),
        minOverlapArea: z.number().min(0).optional(),
      },
    },
    withLogging(
      'media_check_overlaps',
      async (args: { id: string; slideIndex?: number; minOverlapArea?: number }) => {
        const post = getPost(args.id)
        const minArea = args.minOverlapArea ?? 0
        const slidesToCheck =
          args.slideIndex != null
            ? [args.slideIndex]
            : Array.from({ length: post.slides.length }, (_, i) => i)
        const overlaps: { slideIndex: number; a: string; b: string; area: number }[] = []
        for (const s of slidesToCheck) {
          const layers = post.layers.filter((l) => isOnSlide(l, s))
          for (let i = 0; i < layers.length; i++) {
            for (let j = i + 1; j < layers.length; j++) {
              const area = overlapArea(layers[i], layers[j])
              if (area > minArea) {
                overlaps.push({ slideIndex: s, a: layers[i].id, b: layers[j].id, area })
              }
            }
          }
        }
        return textJson({ count: overlaps.length, overlaps })
      },
    ),
  )

  server.registerTool(
    'media_check_bounds',
    {
      description:
        "Flag layers that extend outside the canvas (clipped on export) or outside the 1:1 Instagram-grid safe zone (cropped in profile thumbnails). Returns each violating layer's id, kind, and the side that exceeds.",
      inputSchema: { id: z.string().uuid() },
    },
    withLogging('media_check_bounds', async ({ id }: { id: string }) => {
      const post = getPost(id)
      const safeY0 = (CANVAS.H - CANVAS.W) / 2
      const safeY1 = safeY0 + CANVAS.W
      const violations: {
        layerId: string
        kind: string
        slideIndex: number
        outsideCanvas: string[]
        outsideSafeZone: string[]
      }[] = []
      for (const l of post.layers) {
        const oc: string[] = []
        if (l.x < 0) oc.push('left')
        if (l.y < 0) oc.push('top')
        if (l.x + l.w > CANVAS.W * (l.spans ?? 1)) oc.push('right')
        if (l.y + l.h > CANVAS.H) oc.push('bottom')
        const sz: string[] = []
        if (l.y < safeY0) sz.push('above-safe')
        if (l.y + l.h > safeY1) sz.push('below-safe')
        if (oc.length || sz.length) {
          violations.push({
            layerId: l.id,
            kind: l.kind,
            slideIndex: l.slideIndex,
            outsideCanvas: oc,
            outsideSafeZone: sz,
          })
        }
      }
      return textJson({ count: violations.length, violations })
    }),
  )

  server.registerTool(
    'media_compare_layers',
    {
      description:
        'Side-by-side table of selected properties across layers. Pass layer property keys (fontSize/color/etc) and get a row per layer. Quick consistency check.',
      inputSchema: {
        id: z.string().uuid(),
        layerIds: z.array(z.string().uuid()).min(1).max(50),
        properties: z.array(z.string()).min(1).max(20),
      },
    },
    withLogging(
      'media_compare_layers',
      async (args: { id: string; layerIds: string[]; properties: string[] }) => {
        const post = getPost(args.id)
        const rows = args.layerIds.map((lid) => {
          const l = post.layers.find((x) => x.id === lid)
          if (!l) return { layerId: lid, error: 'not found' }
          const row: Record<string, unknown> = {
            layerId: l.id,
            kind: l.kind,
            slideIndex: l.slideIndex,
            x: l.x,
            y: l.y,
            w: l.w,
            h: l.h,
          }
          for (const k of args.properties) {
            row[k] = (l as unknown as Record<string, unknown>)[k]
          }
          return row
        })
        return textJson({ rows })
      },
    ),
  )

  server.registerTool(
    'media_text_metrics',
    {
      description:
        "Estimate render dimensions of a text layer + flag overflow. Uses an average-glyph-width heuristic (~10% accuracy). Cheaper than a screenshot for quick 'will this fit' checks.",
      inputSchema: {
        id: z.string().uuid(),
        layerId: z.string().uuid(),
      },
    },
    withLogging(
      'media_text_metrics',
      async ({ id, layerId }: { id: string; layerId: string }) => {
        const post = getPost(id)
        const l = post.layers.find((x) => x.id === layerId)
        if (!l) throw new Error(`layer ${layerId} not found`)
        if (l.kind !== 'text') throw new Error(`layer ${layerId} is not a text layer`)
        const family = l.fontFamily ?? 'display'
        const glyphRatio =
          family === 'mono' ? 0.6 : family === 'sans' ? 0.56 : 0.55
        const charW = l.fontSize * glyphRatio
        const lineH = l.fontSize * (l.lineHeight ?? 1.1)
        const words = l.text.split(/\s+/)
        let line = ''
        let lines = 0
        for (const w of words) {
          const candidate = line ? `${line} ${w}` : w
          if (candidate.length * charW > l.w && line) {
            lines++
            line = w
          } else {
            line = candidate
          }
        }
        if (line) lines++
        const heightNeeded = lines * lineH
        return textJson({
          family,
          chars: l.text.length,
          words: words.length,
          estimatedLines: lines,
          estimatedHeightNeeded: Math.round(heightNeeded),
          layerHeight: l.h,
          overflowsHeight: heightNeeded > l.h,
          singleWordTooWide: Math.max(...words.map((w) => w.length)) * charW > l.w,
        })
      },
    ),
  )

  server.registerTool(
    'media_validate_layout',
    {
      description:
        'Run the default suite (bounds + overlaps + text overflow) across a post. Returns a single warnings list — empty means clean. Use as a pre-flight before exporting.',
      inputSchema: { id: z.string().uuid() },
    },
    withLogging('media_validate_layout', async ({ id }: { id: string }) => {
      const post = getPost(id)
      const warnings: {
        type: string
        slideIndex?: number
        layerId?: string
        detail: string
      }[] = []
      for (const l of post.layers) {
        const sides: string[] = []
        if (l.x < 0) sides.push('left')
        if (l.y < 0) sides.push('top')
        if (l.x + l.w > CANVAS.W * (l.spans ?? 1)) sides.push('right')
        if (l.y + l.h > CANVAS.H) sides.push('bottom')
        if (sides.length) {
          warnings.push({
            type: 'bounds',
            slideIndex: l.slideIndex,
            layerId: l.id,
            detail: `outside canvas: ${sides.join(',')}`,
          })
        }
      }
      for (let s = 0; s < post.slides.length; s++) {
        const ls = post.layers.filter((l) => isOnSlide(l, s))
        for (let i = 0; i < ls.length; i++) {
          for (let j = i + 1; j < ls.length; j++) {
            const area = overlapArea(ls[i], ls[j])
            if (area > 5000) {
              warnings.push({
                type: 'overlap',
                slideIndex: s,
                detail: `${ls[i].id} (${ls[i].kind}) overlaps ${ls[j].id} (${ls[j].kind}), area ${Math.round(area)}`,
              })
            }
          }
        }
      }
      for (const l of post.layers) {
        if (l.kind !== 'text') continue
        const family = l.fontFamily ?? 'display'
        const glyphRatio =
          family === 'mono' ? 0.6 : family === 'sans' ? 0.56 : 0.55
        const charW = l.fontSize * glyphRatio
        const lineH = l.fontSize * (l.lineHeight ?? 1.1)
        const words = l.text.split(/\s+/)
        let line = ''
        let lines = 0
        for (const w of words) {
          const candidate = line ? `${line} ${w}` : w
          if (candidate.length * charW > l.w && line) {
            lines++
            line = w
          } else {
            line = candidate
          }
        }
        if (line) lines++
        if (lines * lineH > l.h) {
          warnings.push({
            type: 'text-overflow',
            slideIndex: l.slideIndex,
            layerId: l.id,
            detail: `text needs ~${lines} lines (${Math.round(lines * lineH)}px) but layer is ${l.h}px tall`,
          })
        }
      }
      return textJson({ count: warnings.length, warnings })
    }),
  )
}

// ─── Helpers ────────────────────────────────────────────────────────

function pickLayers(
  post: MediaPost,
  layerIds: string[] | undefined,
  slideIndex: number | undefined,
): Layer[] {
  if (layerIds) return post.layers.filter((l) => layerIds.includes(l.id))
  if (slideIndex != null) return post.layers.filter((l) => isOnSlide(l, slideIndex))
  return post.layers
}

function overlapArea(a: Layer, b: Layer): number {
  if (a.slideIndex !== b.slideIndex) return 0
  const x0 = Math.max(a.x, b.x)
  const y0 = Math.max(a.y, b.y)
  const x1 = Math.min(a.x + a.w, b.x + b.w)
  const y1 = Math.min(a.y + a.h, b.y + b.h)
  if (x1 <= x0 || y1 <= y0) return 0
  return (x1 - x0) * (y1 - y0)
}
