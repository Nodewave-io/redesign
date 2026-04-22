// Asset curation — let Claude save reusable code components into the
// library, refine metadata on existing assets, and clean trial uploads.
// Image uploads stay manual via the editor's upload UI.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { getPost } from '../../db/repo.js'
import {
  createAsset,
  deleteAsset as repoDeleteAsset,
  updateAsset as repoUpdateAsset,
} from '../../db/repo.js'
import { removeStoredFile } from '../../db/storage.js'
import type { CodeLayer } from '../../db/types.js'

export function registerAssetCurateTools(server: McpServer): void {
  server.registerTool(
    'media_create_component_asset',
    {
      description:
        "Register a fresh TSX source as a reusable component asset, without first putting it on a post. Use this when the user pastes/links a 21st.dev / magicui / external snippet and wants it saved to the library. ALWAYS run media_validate_code(source) first to catch syntax errors before they land in the library. ALWAYS draft usage_notes WITH the user (ask intent, themes, sizing, swap points) — don't make them up. Same category guidance as media_save_layer_as_asset.",
      inputSchema: {
        name: z.string().min(1).max(200),
        source_code: z.string().min(1).max(100_000),
        description: z.string().max(1000).optional(),
        usage_notes: z.string().min(1).max(4000),
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    withLogging(
      'media_create_component_asset',
      async (args: {
        name: string
        source_code: string
        description?: string
        usage_notes: string
        categories?: string[]
        tags?: string[]
      }) => {
        const asset = createAsset({
          kind: 'component',
          name: args.name,
          description: args.description ?? null,
          usage_notes: args.usage_notes,
          categories: args.categories ?? ['components'],
          tags: args.tags ?? [],
          file_url: null,
          storage_path: null,
          mime_type: null,
          width: null,
          height: null,
          source_code: args.source_code,
        })
        return textJson({
          id: asset.id,
          name: asset.name,
          kind: asset.kind,
          categories: asset.categories,
          created_at: asset.created_at,
        })
      },
    ),
  )

  server.registerTool(
    'media_save_layer_as_asset',
    {
      description:
        "Promote a CODE layer from a post into a reusable component asset in the library. Copies the layer's source into a new media_assets row of kind='component'. The post itself is unchanged. Always ASK the user for usage_notes if they didn't supply them — that's the field future sessions read to know when/how to use the asset.\n\nCategory guidance (keep it tight, future Claudes search by these): use ONLY shape kinds ('card','chart','hero','cta','quote','stat'), theme hints ('dark','light'), and domain tags ('crm','finance','sales','marketing'). Skip 'component' (implicit when kind=component), 'slide' (everything renders on a slide), and 'data-viz' for things that aren't real charts. Put granular descriptors in `tags` instead.",
      inputSchema: {
        postId: z.string().uuid(),
        layerId: z.string().uuid(),
        name: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
        usage_notes: z.string().min(1).max(4000),
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    withLogging(
      'media_save_layer_as_asset',
      async (args: {
        postId: string
        layerId: string
        name: string
        description?: string
        usage_notes: string
        categories?: string[]
        tags?: string[]
      }) => {
        const post = getPost(args.postId)
        const layer = post.layers.find((l) => l.id === args.layerId)
        if (!layer) throw new Error(`layer ${args.layerId} not found on post`)
        if (layer.kind !== 'code') {
          throw new Error(
            `media_save_layer_as_asset only works on code layers. ${args.layerId} is kind=${layer.kind}. Non-code elements are trivially recreatable from the inspector.`,
          )
        }
        const code = layer as CodeLayer
        const asset = createAsset({
          kind: 'component',
          name: args.name,
          description: args.description ?? null,
          usage_notes: args.usage_notes,
          categories: args.categories ?? ['components'],
          tags: args.tags ?? [],
          file_url: null,
          storage_path: null,
          mime_type: null,
          width: null,
          height: null,
          source_code: code.source,
        })
        return textJson({
          id: asset.id,
          name: asset.name,
          kind: asset.kind,
          categories: asset.categories,
          created_at: asset.created_at,
        })
      },
    ),
  )

  server.registerTool(
    'media_update_asset',
    {
      description:
        "Patch an existing asset's metadata — `name`, `description`, `usage_notes`, `categories`, `tags`. Use this to refine `usage_notes` once you've seen how an asset works in real slides. Cannot change `kind`, `source_code`, or `file_url` — re-upload via the UI for those.",
      inputSchema: {
        id: z.string().uuid(),
        patch: z
          .object({
            name: z.string().min(1).max(200).optional(),
            description: z.string().max(1000).nullable().optional(),
            usage_notes: z.string().max(4000).nullable().optional(),
            categories: z.array(z.string()).optional(),
            tags: z.array(z.string()).optional(),
          })
          .refine((v) => Object.keys(v).length > 0, {
            message: 'patch must have at least one field',
          }),
      },
    },
    withLogging(
      'media_update_asset',
      async (args: {
        id: string
        patch: {
          name?: string
          description?: string | null
          usage_notes?: string | null
          categories?: string[]
          tags?: string[]
        }
      }) => {
        const asset = repoUpdateAsset(args.id, args.patch)
        return textJson({
          id: asset.id,
          name: asset.name,
          description: asset.description,
          usage_notes: asset.usage_notes,
          categories: asset.categories,
          tags: asset.tags,
        })
      },
    ),
  )

  server.registerTool(
    'media_delete_asset',
    {
      description:
        "Permanently delete an asset by id. For image assets, also removes the underlying file from disk. ASK the user before calling — once gone, the asset is gone (no soft delete). Only use for trial uploads or assets the user explicitly asked to remove.",
      inputSchema: {
        id: z.string().uuid(),
      },
    },
    withLogging('media_delete_asset', async ({ id }: { id: string }) => {
      const asset = repoDeleteAsset(id)
      // Best-effort blob cleanup — failure to remove the file isn't
      // fatal (the row is already gone).
      if (asset.storage_path) {
        await removeStoredFile(asset.storage_path).catch(() => {})
      }
      return textJson({ deleted: id, name: asset.name })
    }),
  )
}
