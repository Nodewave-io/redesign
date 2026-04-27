// Write tools for media_collections. Create / rename / delete.
// Deleting a collection that still holds posts is rejected; the
// caller must move or delete those posts first.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from '../../db/repo.js'

export function registerCollectionWriteTools(server: McpServer): void {
  server.registerTool(
    'media_create_collection',
    {
      description:
        'Create a new collection. Pass a short human-readable name (e.g. "Nodewave", "Redesign marketing", "Acme Corp"). Returns the new collection.',
      inputSchema: {
        name: z.string().min(1).max(120),
      },
    },
    withLogging(
      'media_create_collection',
      async ({ name }: { name: string }) => textJson(createCollection(name)),
    ),
  )

  server.registerTool(
    'media_update_collection',
    {
      description: 'Rename a collection.',
      inputSchema: {
        id: z.string().uuid(),
        name: z.string().min(1).max(120),
      },
    },
    withLogging(
      'media_update_collection',
      async ({ id, name }: { id: string; name: string }) =>
        textJson(updateCollection(id, name)),
    ),
  )

  server.registerTool(
    'media_delete_collection',
    {
      description:
        'Delete a collection. Fails if the collection still has posts; move or delete those first.',
      inputSchema: { id: z.string().uuid() },
    },
    withLogging('media_delete_collection', async ({ id }: { id: string }) => {
      deleteCollection(id)
      return textJson({ deleted: id })
    }),
  )
}
