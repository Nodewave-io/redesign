// Read-only tools for media_collections. Collections group posts so
// the same install can hold (e.g.) Nodewave + Redesign-marketing posts
// without mixing them in the same list. Every post belongs to exactly
// one collection, so media_create_post needs a collection_id.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { getCollection, listCollections } from '../../db/repo.js'

export function registerCollectionReadTools(server: McpServer): void {
  server.registerTool(
    'media_list_collections',
    {
      description:
        'List every collection (id + name + timestamps), oldest first. Call this before media_create_post so you know which collection_id to pass, or to ask the user which collection a new post belongs in.',
      inputSchema: {},
    },
    withLogging('media_list_collections', async () =>
      textJson(listCollections()),
    ),
  )

  server.registerTool(
    'media_get_collection',
    {
      description:
        'Fetch a single collection by id. Returns id, name, created_at, updated_at.',
      inputSchema: { id: z.string().uuid() },
    },
    withLogging(
      'media_get_collection',
      async ({ id }: { id: string }) => textJson(getCollection(id)),
    ),
  )
}
