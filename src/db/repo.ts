// Repository layer — the ONLY module that touches SQL. Everything
// above (MCP tools, Next API routes) calls into these functions and
// gets typed domain objects back.
//
// Conventions:
//   • All functions are synchronous (better-sqlite3 is sync).
//   • Errors are thrown, not returned — callers wrap with try/catch
//     or let withLogging in the MCP catch them.
//   • Optimistic concurrency: updatePost(id, patch, expected)
//     returns the new post, or throws StaleUpdateError if the caller's
//     `expected` updated_at no longer matches. Mirrors the
//     .eq('updated_at', expected) pattern from the Supabase version.
//   • JSON columns (slides, categories, tags) are serialized here and
//     parsed back on read, so callers never see raw strings.

import { randomUUID } from 'node:crypto'
import type Database from 'better-sqlite3'
import { getDb } from './client.js'
import type {
  Layer,
  MediaAsset,
  MediaPost,
  MediaPostRevision,
  McpLogRow,
  RevisionSource,
  Slide,
  Theme,
} from './types.js'

// SQLite's `strftime('%Y-%m-%dT%H:%M:%fZ','now')` has ms precision —
// not enough when a batch (or a test) fires two updates inside the
// same ms. We issue timestamps from JS and guarantee strict
// monotonicity relative to both our own process AND whatever the DB
// already holds. The `floor` argument is the value we need to beat
// (typically the row's current updated_at just before an update), so
// a create-then-update in the same ms still advances.
let _lastTs = ''
function nowMonotonic(floor?: string): string {
  const ts = new Date().toISOString()
  let next = ts > _lastTs ? ts : _lastTs
  if (floor && next <= floor) {
    next = new Date(new Date(floor).getTime() + 1).toISOString()
  } else if (next === _lastTs) {
    // Same ms as the previous issue (or clock drift). Bump by 1ms so
    // updated_at strictly advances.
    next = new Date(new Date(_lastTs).getTime() + 1).toISOString()
  }
  _lastTs = next
  return next
}

export class StaleUpdateError extends Error {
  constructor(public readonly id: string) {
    super(
      `media_post ${id} was modified by another writer since your read. ` +
        'Re-fetch with media_get_post and re-apply your changes against the fresh updated_at.',
    )
    this.name = 'StaleUpdateError'
  }
}

export class NotFoundError extends Error {
  constructor(table: string, id: string) {
    super(`${table} ${id} not found`)
    this.name = 'NotFoundError'
  }
}

// ─── Posts ────────────────────────────────────────────────────────

export type PostSummary = Pick<
  MediaPost,
  'id' | 'title' | 'theme' | 'page_count' | 'updated_at' | 'thumbnail_url'
>

export function listPosts(): PostSummary[] {
  const rows = getDb()
    .prepare<[], PostSummaryRow>(
      `SELECT id, title, theme, page_count, updated_at, thumbnail_url
         FROM media_posts
         ORDER BY updated_at DESC`,
    )
    .all()
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    theme: r.theme,
    page_count: r.page_count,
    updated_at: r.updated_at,
    thumbnail_url: r.thumbnail_url,
  }))
}

export function getPost(id: string): MediaPost {
  const row = getDb()
    .prepare<[string], PostRow>(`SELECT * FROM media_posts WHERE id = ?`)
    .get(id)
  if (!row) throw new NotFoundError('media_posts', id)
  return postFromRow(row)
}

export type NewPostInput = {
  title?: string
  page_count?: number
  aspect_ratio?: string
  theme?: Theme
  slides?: Slide[]
  layers?: Layer[]
  thumbnail_url?: string | null
}

export function createPost(input: NewPostInput): MediaPost {
  const id = randomUUID()
  const pageCount = input.page_count ?? 3
  // If the caller gives a page_count but no slides, auto-generate
  // blank slide stubs so page_count and slides.length stay in sync.
  const slides =
    input.slides ??
    Array.from({ length: pageCount }, () => ({ id: randomUUID() }))
  const slidesJson = JSON.stringify({
    slides,
    layers: input.layers ?? [],
  })
  getDb()
    .prepare(
      `INSERT INTO media_posts (id, title, page_count, aspect_ratio, theme, slides, thumbnail_url)
       VALUES (@id, @title, @page_count, @aspect_ratio, @theme, @slides, @thumbnail_url)`,
    )
    .run({
      id,
      title: input.title ?? 'Untitled post',
      page_count: input.page_count ?? 3,
      aspect_ratio: input.aspect_ratio ?? '4:5',
      theme: input.theme ?? 'dark',
      slides: slidesJson,
      thumbnail_url: input.thumbnail_url ?? null,
    })
  return getPost(id)
}

export type PostPatch = Partial<{
  title: string
  page_count: number
  aspect_ratio: string
  theme: Theme
  slides: Slide[]
  layers: Layer[]
  thumbnail_url: string | null
}>

// Optimistic concurrency. If `expected_updated_at` is supplied and
// doesn't match the row's current updated_at, throw StaleUpdateError.
// Pass `undefined` to skip the check (editor auto-save uses the check,
// admin rename from the grid doesn't).
export function updatePost(
  id: string,
  patch: PostPatch,
  expected_updated_at?: string,
): MediaPost {
  const db = getDb()
  const tx = db.transaction(() => {
    if (expected_updated_at !== undefined) {
      const cur = db
        .prepare<[string], { updated_at: string }>(
          `SELECT updated_at FROM media_posts WHERE id = ?`,
        )
        .get(id)
      if (!cur) throw new NotFoundError('media_posts', id)
      if (cur.updated_at !== expected_updated_at) throw new StaleUpdateError(id)
    }

    const cols: string[] = []
    const params: Record<string, unknown> = { id }
    if (patch.title !== undefined) {
      cols.push('title = @title')
      params.title = patch.title
    }
    if (patch.page_count !== undefined) {
      cols.push('page_count = @page_count')
      params.page_count = patch.page_count
    }
    if (patch.aspect_ratio !== undefined) {
      cols.push('aspect_ratio = @aspect_ratio')
      params.aspect_ratio = patch.aspect_ratio
    }
    if (patch.theme !== undefined) {
      cols.push('theme = @theme')
      params.theme = patch.theme
    }
    if (patch.slides !== undefined || patch.layers !== undefined) {
      const cur = getPost(id)
      const slides = patch.slides ?? cur.slides
      const layers = patch.layers ?? cur.layers
      cols.push('slides = @slides')
      params.slides = JSON.stringify({ slides, layers })
    }
    if (patch.thumbnail_url !== undefined) {
      cols.push('thumbnail_url = @thumbnail_url')
      params.thumbnail_url = patch.thumbnail_url
    }
    if (cols.length === 0) return  // no-op patch; still return current row below

    // Thumbnail-only updates are background, fire-and-forget writes
    // (the export route persists the first slide as a thumbnail).
    // They must NOT bump updated_at — otherwise the editor's
    // in-memory expected_updated_at goes stale and the very next
    // user save fails with a 409. Content edits still advance
    // normally. Mirror the schema trigger which now skips the
    // thumbnail-only auto-touch case.
    const isThumbnailOnly =
      patch.thumbnail_url !== undefined &&
      patch.title === undefined &&
      patch.page_count === undefined &&
      patch.aspect_ratio === undefined &&
      patch.theme === undefined &&
      patch.slides === undefined &&
      patch.layers === undefined
    if (!isThumbnailOnly) {
      // Bump updated_at explicitly from JS so it strictly advances.
      // Pass the CURRENT row's updated_at as the floor so the new
      // value is guaranteed > current even when the DB's
      // default-generated timestamp was issued in the same ms as
      // JS's Date.now().
      const currentTs = db
        .prepare<[string], { updated_at: string }>(
          `SELECT updated_at FROM media_posts WHERE id = ?`,
        )
        .get(id)?.updated_at
      cols.push('updated_at = @updated_at')
      params.updated_at = nowMonotonic(currentTs)
    }

    const sql = `UPDATE media_posts SET ${cols.join(', ')} WHERE id = @id`
    const info = db.prepare(sql).run(params)
    if (info.changes === 0) throw new NotFoundError('media_posts', id)
  })
  tx()
  return getPost(id)
}

export function deletePost(id: string): void {
  const info = getDb().prepare(`DELETE FROM media_posts WHERE id = ?`).run(id)
  if (info.changes === 0) throw new NotFoundError('media_posts', id)
}

// ─── Revisions ────────────────────────────────────────────────────

export function listRevisions(postId: string, limit = 30): MediaPostRevision[] {
  const rows = getDb()
    .prepare<[string, number], RevisionRow>(
      `SELECT id, post_id, snapshot, source, note, created_at
         FROM media_post_revisions
         WHERE post_id = ?
         ORDER BY created_at DESC
         LIMIT ?`,
    )
    .all(postId, limit)
  return rows.map(revisionFromRow)
}

export function getRevision(id: string): MediaPostRevision {
  const row = getDb()
    .prepare<[string], RevisionRow>(
      `SELECT id, post_id, snapshot, source, note, created_at
         FROM media_post_revisions WHERE id = ?`,
    )
    .get(id)
  if (!row) throw new NotFoundError('media_post_revisions', id)
  return revisionFromRow(row)
}

export function createRevision(
  postId: string,
  snapshot: MediaPost,
  source: RevisionSource,
  note: string | null = null,
): MediaPostRevision {
  const id = randomUUID()
  getDb()
    .prepare(
      `INSERT INTO media_post_revisions (id, post_id, snapshot, source, note)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(id, postId, JSON.stringify(snapshot), source, note)
  return getRevision(id)
}

// ─── Assets ───────────────────────────────────────────────────────

export function listAssets(kind?: 'image' | 'component'): MediaAsset[] {
  const db = getDb()
  const rows = kind
    ? db
        .prepare<[string], AssetRow>(
          `SELECT * FROM media_assets WHERE kind = ? ORDER BY created_at DESC`,
        )
        .all(kind)
    : db
        .prepare<[], AssetRow>(
          `SELECT * FROM media_assets ORDER BY created_at DESC`,
        )
        .all()
  return rows.map(assetFromRow)
}

export function getAsset(id: string): MediaAsset {
  const row = getDb()
    .prepare<[string], AssetRow>(`SELECT * FROM media_assets WHERE id = ?`)
    .get(id)
  if (!row) throw new NotFoundError('media_assets', id)
  return assetFromRow(row)
}

export type NewAssetInput = Omit<MediaAsset, 'id' | 'created_at'>

export function createAsset(input: NewAssetInput): MediaAsset {
  const id = randomUUID()
  getDb()
    .prepare(
      `INSERT INTO media_assets (
         id, kind, name, description, usage_notes, categories, tags,
         file_url, storage_path, mime_type, width, height, source_code
       ) VALUES (
         @id, @kind, @name, @description, @usage_notes, @categories, @tags,
         @file_url, @storage_path, @mime_type, @width, @height, @source_code
       )`,
    )
    .run({
      id,
      kind: input.kind,
      name: input.name,
      description: input.description,
      usage_notes: input.usage_notes,
      categories: JSON.stringify(input.categories ?? []),
      tags: JSON.stringify(input.tags ?? []),
      file_url: input.file_url,
      storage_path: input.storage_path,
      mime_type: input.mime_type,
      width: input.width,
      height: input.height,
      source_code: input.source_code,
    })
  return getAsset(id)
}

export type AssetPatch = Partial<
  Pick<
    MediaAsset,
    'name' | 'description' | 'usage_notes' | 'categories' | 'tags' | 'source_code' | 'width' | 'height'
  >
>

export function updateAsset(id: string, patch: AssetPatch): MediaAsset {
  const cols: string[] = []
  const params: Record<string, unknown> = { id }
  if (patch.name !== undefined) {
    cols.push('name = @name')
    params.name = patch.name
  }
  if (patch.description !== undefined) {
    cols.push('description = @description')
    params.description = patch.description
  }
  if (patch.usage_notes !== undefined) {
    cols.push('usage_notes = @usage_notes')
    params.usage_notes = patch.usage_notes
  }
  if (patch.categories !== undefined) {
    cols.push('categories = @categories')
    params.categories = JSON.stringify(patch.categories)
  }
  if (patch.tags !== undefined) {
    cols.push('tags = @tags')
    params.tags = JSON.stringify(patch.tags)
  }
  if (patch.source_code !== undefined) {
    cols.push('source_code = @source_code')
    params.source_code = patch.source_code
  }
  if (patch.width !== undefined) {
    cols.push('width = @width')
    params.width = patch.width
  }
  if (patch.height !== undefined) {
    cols.push('height = @height')
    params.height = patch.height
  }
  if (cols.length === 0) return getAsset(id)
  const info = getDb()
    .prepare(`UPDATE media_assets SET ${cols.join(', ')} WHERE id = @id`)
    .run(params)
  if (info.changes === 0) throw new NotFoundError('media_assets', id)
  return getAsset(id)
}

export function deleteAsset(id: string): MediaAsset {
  const asset = getAsset(id)
  getDb().prepare(`DELETE FROM media_assets WHERE id = ?`).run(id)
  return asset
}

// ─── MCP log ──────────────────────────────────────────────────────

export function insertMcpLog(row: McpLogRow): void {
  getDb()
    .prepare(
      `INSERT INTO media_mcp_log (tool_name, args_digest, post_id, status, duration_ms, error_message)
       VALUES (@tool_name, @args_digest, @post_id, @status, @duration_ms, @error_message)`,
    )
    .run(row)
}

// ─── Row → domain object converters ───────────────────────────────

type PostSummaryRow = {
  id: string
  title: string
  theme: Theme
  page_count: number
  updated_at: string
  thumbnail_url: string | null
}

type PostRow = {
  id: string
  title: string
  page_count: number
  aspect_ratio: string
  theme: Theme
  slides: string
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}

type RevisionRow = {
  id: string
  post_id: string
  snapshot: string
  source: RevisionSource
  note: string | null
  created_at: string
}

type AssetRow = {
  id: string
  kind: 'image' | 'component'
  name: string
  description: string | null
  usage_notes: string | null
  categories: string
  tags: string
  file_url: string | null
  storage_path: string | null
  mime_type: string | null
  width: number | null
  height: number | null
  source_code: string | null
  created_at: string
}

function postFromRow(row: PostRow): MediaPost {
  const parsed = JSON.parse(row.slides) as {
    slides?: Slide[] | { slides?: Slide[]; layers?: Layer[] }
    layers?: Layer[]
  }
  // Older rows wrote `{slides: {slides, layers}, layers: []}` (the
  // editor's verbatim Supabase path stored its single JSON column
  // wrapper). Detect and unwrap so MCP tools see a flat shape.
  const inner = parsed?.slides
  let slides: Slide[]
  let layers: Layer[]
  if (inner && !Array.isArray(inner) && 'slides' in inner) {
    slides = inner.slides ?? []
    layers = inner.layers ?? []
  } else {
    slides = (Array.isArray(inner) ? inner : []) as Slide[]
    layers = parsed?.layers ?? []
  }
  return {
    id: row.id,
    title: row.title,
    page_count: row.page_count,
    aspect_ratio: row.aspect_ratio,
    theme: row.theme,
    slides,
    layers,
    thumbnail_url: row.thumbnail_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function revisionFromRow(row: RevisionRow): MediaPostRevision {
  return {
    id: row.id,
    post_id: row.post_id,
    snapshot: JSON.parse(row.snapshot) as MediaPost,
    source: row.source,
    note: row.note,
    created_at: row.created_at,
  }
}

function assetFromRow(row: AssetRow): MediaAsset {
  return {
    id: row.id,
    kind: row.kind,
    name: row.name,
    description: row.description,
    usage_notes: row.usage_notes,
    categories: JSON.parse(row.categories) as string[],
    tags: JSON.parse(row.tags) as string[],
    file_url: row.file_url,
    storage_path: row.storage_path,
    mime_type: row.mime_type,
    width: row.width,
    height: row.height,
    source_code: row.source_code,
    created_at: row.created_at,
  }
}

// Re-export the Database type so callers can thread it if they want
// to pass an override (tests use this to point at an in-memory DB).
export type { Database }
