// Post-level write tools. Create, title/theme/page-count edits,
// per-slide background colors. Layer CRUD lives in layers-write.ts.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { applyWrite, cryptoId, textJson } from '../write-helpers.js'
import { themeSchema } from '../schemas.js'
import {
  NotFoundError,
  createPost,
  deletePost,
  getCollection,
  getPost,
  listCollections,
} from '../../db/repo.js'
import type { Slide } from '../../db/types.js'

export function registerPostWriteTools(server: McpServer): void {
  server.registerTool(
    'media_create_post',
    {
      description:
        'Create a new empty media post inside a specific collection. ' +
        'Pass `collection_id` from `media_list_collections`. If you do not know which collection to use, call media_list_collections first and ask the user. ' +
        'Returns the new post id + updated_at. Default 3 slides, dark theme, 4:5 aspect ratio.',
      inputSchema: {
        collection_id: z.string().uuid().optional(),
        title: z.string().min(1).max(200).optional(),
        page_count: z.number().int().min(1).max(20).optional(),
        theme: themeSchema.optional(),
      },
    },
    withLogging(
      'media_create_post',
      async (args: {
        collection_id?: string
        title?: string
        page_count?: number
        theme?: 'dark' | 'light'
      }) => {
        if (!args.collection_id) {
          // Surface the available collections in the error so Claude
          // can pick one or ask the user without a second tool round.
          const collections = listCollections().map((c) => ({
            id: c.id,
            name: c.name,
          }))
          throw new Error(
            'collection_id is required. Available collections: ' +
              JSON.stringify(collections) +
              '. Ask the user which collection this post belongs in, or call media_create_collection to make a new one.',
          )
        }
        // Validate the collection exists before insert so an invalid id
        // produces a clear error rather than a SQLite FK violation.
        try {
          getCollection(args.collection_id)
        } catch (err) {
          if (err instanceof NotFoundError) {
            const collections = listCollections().map((c) => ({
              id: c.id,
              name: c.name,
            }))
            throw new Error(
              `collection_id ${args.collection_id} does not exist. Available collections: ` +
                JSON.stringify(collections),
            )
          }
          throw err
        }
        const pageCount = args.page_count ?? 3
        const slides: Slide[] = Array.from({ length: pageCount }, () => ({ id: cryptoId() }))
        const post = createPost({
          collection_id: args.collection_id,
          title: args.title ?? 'Untitled post',
          page_count: pageCount,
          aspect_ratio: '4:5',
          theme: args.theme ?? 'dark',
          slides,
          layers: [],
        })
        return textJson({ id: post.id, updated_at: post.updated_at })
      },
    ),
  )

  server.registerTool(
    'media_update_post',
    {
      description:
        'Patch post-level fields (title, theme). Include expected_updated_at from your last media_get_post call; the write is rejected if the row has changed since.',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        patch: z
          .object({
            title: z.string().min(1).max(200).optional(),
            theme: themeSchema.optional(),
          })
          .refine((v) => Object.keys(v).length > 0, {
            message: 'patch must have at least one field',
          }),
      },
    },
    withLogging(
      'media_update_post',
      async (args: {
        id: string
        expected_updated_at: string
        patch: { title?: string; theme?: 'dark' | 'light' }
      }) => {
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          () => ({ fields: args.patch }),
          `update_post ${Object.keys(args.patch).join(',')}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_set_page_count',
    {
      description:
        'Grow or shrink the slide count. Growing appends blank slides at the end. Shrinking drops slides AND any layers whose slideIndex lands on a removed slide (bleed layers past the cut are also removed).',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        n: z.number().int().min(1).max(20),
      },
    },
    withLogging(
      'media_set_page_count',
      async (args: { id: string; expected_updated_at: string; n: number }) => {
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            const currentN = current.slides.length
            let slides = current.slides
            let layers = current.layers
            if (args.n > currentN) {
              const add: Slide[] = Array.from({ length: args.n - currentN }, () => ({
                id: cryptoId(),
              }))
              slides = [...slides, ...add]
            } else if (args.n < currentN) {
              slides = slides.slice(0, args.n)
              layers = layers.filter((l) => l.slideIndex < args.n)
            }
            return { slides, layers, fields: { page_count: args.n } }
          },
          `set_page_count ${args.n}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_set_slide_background',
    {
      description:
        "Override the background color of a single slide. Pass null to clear the override and fall back to the post theme's default.",
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        slideIndex: z.number().int().min(0),
        background: z.string().nullable(),
      },
    },
    withLogging(
      'media_set_slide_background',
      async (args: {
        id: string
        expected_updated_at: string
        slideIndex: number
        background: string | null
      }) => {
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          (current) => {
            if (args.slideIndex >= current.slides.length) {
              throw new Error(
                `slideIndex ${args.slideIndex} out of range (post has ${current.slides.length} slides)`,
              )
            }
            const slides = current.slides.map((s, i) =>
              i === args.slideIndex
                ? args.background == null
                  ? { id: s.id }
                  : { ...s, background: args.background }
                : s,
            )
            return { slides }
          },
          `set_slide_background ${args.slideIndex}`,
        )
        return textJson(result)
      },
    ),
  )

  server.registerTool(
    'media_delete_post',
    {
      description:
        'Permanently delete a post (and its revision history via cascade). Prefer archiving over deleting; use only when the user explicitly asks.',
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
      },
    },
    withLogging(
      'media_delete_post',
      async (args: { id: string; expected_updated_at: string }) => {
        const current = getPost(args.id)
        if (current.updated_at !== args.expected_updated_at) {
          throw new Error(
            `stale: expected_updated_at ${args.expected_updated_at} does not match current ${current.updated_at}`,
          )
        }
        deletePost(args.id)
        return textJson({ deleted: args.id })
      },
    ),
  )
}
