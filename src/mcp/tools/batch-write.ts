// Batch + smart-align tools. All built on applyBatch so a single
// MCP call can mutate many layers atomically.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { applyBatch, batchOp, type BatchOp } from '../batch.js'
import { layerPatch } from '../schemas.js'

export function registerBatchTools(server: McpServer): void {
  server.registerTool(
    'media_apply_batch',
    {
      description:
        "Apply many post mutations in a single transactional call. ONE revision snapshot, ONE updated_at check, ONE DB write — orders of magnitude cheaper than issuing many individual write tools. Use this whenever you have more than one change to make. Operations run in array order; later ops see earlier ops' effects. To reference a layer added in this same batch from a later op (e.g. add_layer + immediately set_code_source on it), pre-mint a UUID, pass it as the add_layer op's `id`, then reference that same id in subsequent ops. Returns new updated_at + addedLayerIds (parallel array, only set for add_layer ops).",
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        operations: z.array(batchOp).min(1).max(100),
        note: z.string().max(200).optional(),
      },
    },
    withLogging(
      'media_apply_batch',
      async (args: {
        id: string
        expected_updated_at: string
        operations: BatchOp[]
        note?: string
      }) => {
        const result = applyBatch(
          args.id,
          args.expected_updated_at,
          args.operations,
          args.note ?? `batch:${args.operations.length} ops`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_remove_layers',
    {
      description:
        'Remove many layers in one batch. Cheaper than calling media_remove_layer N times.',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layerIds: z.array(z.string().uuid()).min(1).max(100),
      },
    },
    withLogging(
      'media_remove_layers',
      async (args: { id: string; expected_updated_at: string; layerIds: string[] }) => {
        const ops: BatchOp[] = args.layerIds.map((layerId) => ({
          type: 'remove_layer' as const,
          layerId,
        }))
        const result = applyBatch(
          args.id,
          args.expected_updated_at,
          ops,
          `remove_layers ${args.layerIds.length}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_update_layers',
    {
      description:
        'Patch many layers in one batch. Each entry is { layerId, patch }. Same atomicity as media_apply_batch but specialized so you don\'t have to construct operation objects when all you need is "apply these patches to these layers".',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        patches: z
          .array(
            z.object({
              layerId: z.string().uuid(),
              patch: layerPatch,
            }),
          )
          .min(1)
          .max(100),
      },
    },
    withLogging(
      'media_update_layers',
      async (args: {
        id: string
        expected_updated_at: string
        patches: Array<{ layerId: string; patch: z.infer<typeof layerPatch> }>
      }) => {
        const ops: BatchOp[] = args.patches.map(({ layerId, patch }) => ({
          type: 'update_layer' as const,
          layerId,
          patch,
        }))
        const result = applyBatch(
          args.id,
          args.expected_updated_at,
          ops,
          `update_layers ${args.patches.length}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_align',
    {
      description:
        "Align two or more layers along an axis. 'left'/'right'/'top'/'bottom' snap to the extreme edge among the selected layers. 'centerX'/'centerY' centers them on the average of their centers. Atomic single write.",
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layerIds: z.array(z.string().uuid()).min(2).max(50),
        to: z.enum(['left', 'right', 'top', 'bottom', 'centerX', 'centerY']),
      },
    },
    withLogging(
      'media_align',
      async (args: {
        id: string
        expected_updated_at: string
        layerIds: string[]
        to: 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY'
      }) => {
        const result = applyBatch(
          args.id,
          args.expected_updated_at,
          [{ type: 'align', layerIds: args.layerIds, to: args.to }],
          `align ${args.to} ${args.layerIds.length}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_distribute',
    {
      description:
        "Distribute three or more layers evenly along an axis. mode='gaps' (default) makes the gap between adjacent layer edges equal. mode='centers' makes the layer centers evenly spaced between the first and last layer.",
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        layerIds: z.array(z.string().uuid()).min(3).max(50),
        axis: z.enum(['horizontal', 'vertical']),
        mode: z.enum(['gaps', 'centers']).optional(),
      },
    },
    withLogging(
      'media_distribute',
      async (args: {
        id: string
        expected_updated_at: string
        layerIds: string[]
        axis: 'horizontal' | 'vertical'
        mode?: 'gaps' | 'centers'
      }) => {
        const result = applyBatch(
          args.id,
          args.expected_updated_at,
          [
            {
              type: 'distribute',
              layerIds: args.layerIds,
              axis: args.axis,
              mode: args.mode,
            },
          ],
          `distribute ${args.axis} ${args.layerIds.length}`,
        )
        return textJson(result)
      },
    ),
  )
}
