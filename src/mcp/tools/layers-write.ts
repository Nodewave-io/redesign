// Layer CRUD + code-layer helpers.
//
// Claude composes slides like web pages: stack arbitrary layers
// (text / shape / gradient / image / icon / code) at any x/y/w/h,
// optionally bleeding across slides via `spans`. Every write uses the
// expected_updated_at concurrency guard + auto-snapshots to
// media_post_revisions, so "oops, revert" is always one tool call away.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { applyWrite, cryptoId, textJson } from '../write-helpers.js'
import { layerInput, layerPatch } from '../schemas.js'
import { getAsset } from '../../db/repo.js'
import type { CodeLayer, Layer } from '../../db/types.js'
import { CANVAS } from '../../db/types.js'

export function registerLayerWriteTools(server: McpServer): void {
  server.registerTool(
    'media_add_layer',
    {
      description:
        'Add a layer (text/shape/gradient/image/icon/code) to a post. Layer position is in canvas units (1000×1250 = 4:5 slide). Set `spans` > 1 to let the layer bleed across consecutive slides. Returns the new layerId.',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layer: layerInput,
      },
    },
    withLogging(
      'media_add_layer',
      async (args: {
        id: string
        expected_updated_at: string
        layer: z.infer<typeof layerInput>
      }) => {
        const layerId = cryptoId()
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            validateSlideIndex(args.layer.slideIndex, current.slides.length)
            const full = { ...args.layer, id: layerId } as Layer
            return { layers: [...current.layers, full], returnLayerId: layerId }
          },
          `add_layer ${args.layer.kind}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_add_code_layer_from_asset',
    {
      description:
        "Copy a component-kind asset's source_code into a new code layer on a post. The copy is independent; editing the library asset later won't affect saved posts.",
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        assetId: z.string().uuid(),
        slideIndex: z.number().int().min(0),
        x: z.number().optional(),
        y: z.number().optional(),
        w: z.number().positive().optional(),
        h: z.number().positive().optional(),
        spans: z.number().int().min(1).optional(),
      },
    },
    withLogging(
      'media_add_code_layer_from_asset',
      async (args: {
        id: string
        expected_updated_at: string
        assetId: string
        slideIndex: number
        x?: number
        y?: number
        w?: number
        h?: number
        spans?: number
      }) => {
        const asset = getAsset(args.assetId)
        if (asset.kind !== 'component' || !asset.source_code) {
          throw new Error(`asset ${asset.id} is not a component (kind=${asset.kind})`)
        }
        const layerId = cryptoId()
        const layer: CodeLayer = {
          id: layerId,
          kind: 'code',
          slideIndex: args.slideIndex,
          x: args.x ?? 0,
          y: args.y ?? 0,
          w: args.w ?? CANVAS.W,
          h: args.h ?? CANVAS.H,
          spans: args.spans,
          source: asset.source_code,
        }
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            validateSlideIndex(args.slideIndex, current.slides.length)
            return { layers: [...current.layers, layer], returnLayerId: layerId }
          },
          `add_code_layer_from_asset ${args.assetId}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_update_layer',
    {
      description:
        'Partial-update a layer on a post. Any subset of fields (x/y/w/h, text, color, source, etc.) is merged onto the existing layer.',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layerId: z.string().uuid(),
        patch: layerPatch,
      },
    },
    withLogging(
      'media_update_layer',
      async (args: {
        id: string
        expected_updated_at: string
        layerId: string
        patch: z.infer<typeof layerPatch>
      }) => {
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            const idx = current.layers.findIndex((l) => l.id === args.layerId)
            if (idx === -1) throw new Error(`layer ${args.layerId} not found`)
            if (args.patch.slideIndex != null) {
              validateSlideIndex(args.patch.slideIndex, current.slides.length)
            }
            const layers = [...current.layers]
            layers[idx] = { ...layers[idx], ...args.patch } as Layer
            return { layers }
          },
          `update_layer ${args.layerId.slice(0, 8)}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_set_code_source',
    {
      description:
        "Overwrite the TSX source of a code layer. Use when rewriting the component from scratch (media_update_layer also works but this one reads clearer in logs).",
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layerId: z.string().uuid(),
        source: z.string().max(100_000),
      },
    },
    withLogging(
      'media_set_code_source',
      async (args: {
        id: string
        expected_updated_at: string
        layerId: string
        source: string
      }) => {
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            const idx = current.layers.findIndex((l) => l.id === args.layerId)
            if (idx === -1) throw new Error(`layer ${args.layerId} not found`)
            if (current.layers[idx].kind !== 'code') {
              throw new Error(`layer ${args.layerId} is not a code layer`)
            }
            const layers = [...current.layers]
            layers[idx] = { ...layers[idx], source: args.source } as Layer
            return { layers }
          },
          `set_code_source ${args.layerId.slice(0, 8)}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_remove_layer',
    {
      description: 'Delete a layer by id.',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layerId: z.string().uuid(),
      },
    },
    withLogging(
      'media_remove_layer',
      async (args: { id: string; expected_updated_at: string; layerId: string }) => {
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            const layers = current.layers.filter((l) => l.id !== args.layerId)
            if (layers.length === current.layers.length) {
              throw new Error(`layer ${args.layerId} not found`)
            }
            return { layers }
          },
          `remove_layer ${args.layerId.slice(0, 8)}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_move_layer_z',
    {
      description:
        'Reorder a layer in the z-stack. Higher array index = rendered on top. Use this to lift text above a background gradient, etc.',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layerId: z.string().uuid(),
        direction: z.enum(['up', 'down', 'top', 'bottom']),
      },
    },
    withLogging(
      'media_move_layer_z',
      async (args: {
        id: string
        expected_updated_at: string
        layerId: string
        direction: 'up' | 'down' | 'top' | 'bottom'
      }) => {
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            const idx = current.layers.findIndex((l) => l.id === args.layerId)
            if (idx === -1) throw new Error(`layer ${args.layerId} not found`)
            const arr = [...current.layers]
            const [layer] = arr.splice(idx, 1)
            if (args.direction === 'up') arr.splice(Math.min(idx + 1, arr.length), 0, layer)
            else if (args.direction === 'down') arr.splice(Math.max(idx - 1, 0), 0, layer)
            else if (args.direction === 'top') arr.push(layer)
            else arr.unshift(layer)
            return { layers: arr }
          },
          `move_layer_z ${args.direction} ${args.layerId.slice(0, 8)}`,
        )
        return textJson(result)
      },
    ),
  )
}

function validateSlideIndex(slideIndex: number, slideCount: number): void {
  if (slideIndex < 0 || slideIndex >= slideCount) {
    throw new Error(
      `slideIndex ${slideIndex} out of range (post has ${slideCount} slides, 0-indexed)`,
    )
  }
}
