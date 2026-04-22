// Short-lived render-key store. The export endpoint issues a key for
// each post/export request; the render-data endpoint consumes it
// (single-use) so the headless render page can pull the post JSON
// without needing the admin's browser session. Keys expire after
// 60s so a leaked URL from logs doesn't grant long-term access.

import { randomBytes } from 'node:crypto'

type Entry = { postId: string; expiresAt: number }

const store = new Map<string, Entry>()
const TTL_MS = 60_000

function sweep() {
  const now = Date.now()
  for (const [k, v] of store) if (v.expiresAt <= now) store.delete(k)
}

export function issueRenderKey(postId: string): string {
  sweep()
  const key = randomBytes(16).toString('hex')
  store.set(key, { postId, expiresAt: Date.now() + TTL_MS })
  return key
}

/**
 * Returns true and extends the TTL if the key matches the given post.
 * Extends instead of deleting so puppeteer can load multiple slides
 * with the same key without racing the cleanup.
 */
export function consumeRenderKey(key: string, postId: string): boolean {
  sweep()
  const entry = store.get(key)
  if (!entry || entry.postId !== postId) return false
  // Extend so subsequent per-slide fetches during the same export
  // don't get kicked out. The export job ends in seconds.
  entry.expiresAt = Date.now() + TTL_MS
  return true
}

export function revokeRenderKey(key: string) {
  store.delete(key)
}
