// Read-only tools for the asset library. Claude calls these to discover
// what's already available (icons, gradients, component templates)
// before deciding to write fresh code.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { getAsset, listAssets } from '../../db/repo.js'

export function registerAssetReadTools(server: McpServer): void {
  server.registerTool(
    'media_list_assets',
    {
      description:
        'List assets from the library. Filter by kind ("image"/"component") and/or category. Returns metadata only; use media_get_asset for source_code.',
      inputSchema: {
        kind: z.enum(['image', 'component']).optional(),
        category: z.string().optional(),
        limit: z.number().int().min(1).max(500).optional(),
      },
    },
    withLogging(
      'media_list_assets',
      async (args: { kind?: 'image' | 'component'; category?: string; limit?: number }) => {
        let assets = listAssets(args.kind)
        if (args.category) {
          assets = assets.filter((a) => a.categories.includes(args.category!))
        }
        if (args.limit) assets = assets.slice(0, args.limit)
        // Strip source_code from list responses — it can be huge.
        const slim = assets.map(({ source_code: _sc, ...rest }) => rest)
        return textJson(slim)
      },
    ),
  )

  server.registerTool(
    'media_get_asset',
    {
      description:
        'Fetch a single asset by id. Component assets include the full TSX source under `source_code`; copy it onto a code layer with media_add_layer.',
      inputSchema: { id: z.string().uuid() },
    },
    withLogging('media_get_asset', async ({ id }: { id: string }) => textJson(getAsset(id))),
  )

  server.registerTool(
    'media_search_assets',
    {
      description:
        'Case-insensitive substring search across asset name, description, and usage_notes. Use when you know what you want but not the exact label.',
      inputSchema: {
        q: z.string().min(1),
        kind: z.enum(['image', 'component']).optional(),
        limit: z.number().int().min(1).max(200).optional(),
      },
    },
    withLogging(
      'media_search_assets',
      async (args: { q: string; kind?: 'image' | 'component'; limit?: number }) => {
        const needle = args.q.toLowerCase()
        let hits = listAssets(args.kind).filter((a) => {
          const hay = [a.name, a.description ?? '', a.usage_notes ?? '']
            .join(' ')
            .toLowerCase()
          return hay.includes(needle)
        })
        if (args.limit) hits = hits.slice(0, args.limit)
        // Also strip source_code on search results.
        const slim = hits.map(({ source_code: _sc, ...rest }) => rest)
        return textJson(slim)
      },
    ),
  )
}
