// Revision tools — read and roll back the per-post snapshot history
// written by applyWrite().
//
// Every write snapshots the *pre-edit* state before committing, so
// reverting is "apply snapshot N's slides/layers/fields as the current
// state". The revert itself writes a new snapshot of the about-to-be-
// overwritten state, so it's also undoable.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { applyWrite, textJson } from '../write-helpers.js'
import { getRevision, listRevisions } from '../../db/repo.js'

export function registerRevisionTools(server: McpServer): void {
  server.registerTool(
    'media_list_revisions',
    {
      description:
        'List the most recent snapshots for a post (up to 30 kept). Each entry has source ("editor" or "mcp") and an optional note. Use with media_get_revision to see the full snapshot.',
      inputSchema: {
        id: z.string().uuid(),
        limit: z.number().int().min(1).max(30).optional(),
      },
    },
    withLogging(
      'media_list_revisions',
      async (args: { id: string; limit?: number }) => {
        const revs = listRevisions(args.id, args.limit ?? 30).map((r) => ({
          id: r.id,
          source: r.source,
          note: r.note,
          created_at: r.created_at,
        }))
        return textJson(revs)
      },
    ),
  )

  server.registerTool(
    'media_get_revision',
    {
      description:
        'Fetch a single revision snapshot: the full slides/layers/fields as they were at that point in time. Use to diff against current state before reverting.',
      inputSchema: { revisionId: z.string().uuid() },
    },
    withLogging(
      'media_get_revision',
      async ({ revisionId }: { revisionId: string }) => textJson(getRevision(revisionId)),
    ),
  )

  server.registerTool(
    'media_revert_to',
    {
      description:
        "Replace the current post state with a revision's snapshot. Writes a new snapshot of the about-to-be-overwritten state first, so revert is itself reversible. Include expected_updated_at from your last media_get_post call.",
      inputSchema: {
        id: z.string().uuid(),
        expected_updated_at: z.string(),
        revisionId: z.string().uuid(),
      },
    },
    withLogging(
      'media_revert_to',
      async (args: { id: string; expected_updated_at: string; revisionId: string }) => {
        const rev = getRevision(args.revisionId)
        if (rev.post_id !== args.id) {
          throw new Error(
            `revision ${args.revisionId} belongs to a different post (${rev.post_id})`,
          )
        }
        const snap = rev.snapshot
        const result = applyWrite(
          args.id,
          args.expected_updated_at,
          () => ({
            slides: snap.slides,
            layers: snap.layers,
            fields: {
              title: snap.title,
              page_count: snap.page_count,
              theme: snap.theme,
            },
          }),
          `revert_to ${args.revisionId.slice(0, 8)}`,
        )
        return textJson(result)
      },
    ),
  )
}
