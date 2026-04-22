// Shared plumbing for write tools. The new repo already handles:
//   • concurrency guard   — updatePost(id, patch, expected) throws StaleUpdateError
//   • monotonic updated_at — repo.updatePost issues a fresh ISO timestamp
//   • cascading revision delete — foreign key ON DELETE CASCADE
//
// So applyWrite here is a thin wrapper: fetch, snapshot the pre-edit
// post into media_post_revisions, run the mutator, commit the update.

import {
  createRevision,
  getPost,
  updatePost,
  type PostPatch,
} from '../db/repo.js'
import type { Layer, MediaPost, Slide, Theme } from '../db/types.js'

export type Mutator = (current: MediaPost) => {
  slides?: Slide[]
  layers?: Layer[]
  fields?: Partial<{
    title: string
    page_count: number
    theme: Theme
    thumbnail_url: string | null
  }>
  /** If the mutator just created a layer, return its id so the write
   *  helper can forward it to the caller. */
  returnLayerId?: string
}

export type WriteResult = {
  id: string
  updated_at: string
  returnLayerId?: string
}

export function applyWrite(
  postId: string,
  expectedUpdatedAt: string,
  mutator: Mutator,
  revisionNote: string,
): WriteResult {
  const current = getPost(postId)
  if (current.updated_at !== expectedUpdatedAt) {
    throw new Error(
      `stale: expected_updated_at ${expectedUpdatedAt} does not match current ${current.updated_at}. Re-fetch the post with media_get_post and retry.`,
    )
  }

  // Snapshot the pre-edit state so revert always restores the
  // last-known-good shape.
  createRevision(current.id, current, 'mcp', revisionNote)

  const result = mutator(current)
  const patch: PostPatch = {}
  if (result.slides !== undefined) patch.slides = result.slides
  if (result.layers !== undefined) patch.layers = result.layers
  if (result.fields) {
    if (result.fields.title !== undefined) patch.title = result.fields.title
    if (result.fields.page_count !== undefined) patch.page_count = result.fields.page_count
    if (result.fields.theme !== undefined) patch.theme = result.fields.theme
    if (result.fields.thumbnail_url !== undefined)
      patch.thumbnail_url = result.fields.thumbnail_url
  }

  // Pass expectedUpdatedAt again so repo re-checks concurrency at
  // write time — defends against a second writer slipping in between
  // our fetch above and the commit below.
  const next = updatePost(postId, patch, expectedUpdatedAt)
  return {
    id: next.id,
    updated_at: next.updated_at,
    returnLayerId: result.returnLayerId,
  }
}

export function cryptoId(): string {
  return crypto.randomUUID()
}

export function textJson(value: unknown): {
  content: [{ type: 'text'; text: string }]
} {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] }
}
