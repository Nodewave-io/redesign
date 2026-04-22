// Client-side translator: maps the legacy Supabase call shape the
// editor uses onto the local `/api/posts`, `/api/assets`, and
// `/api/storage/upload` routes backed by SQLite.
//
// This file is the ONLY place that talks "Supabase shape". Every
// editor file is still the verbatim nw-site copy; they call
// `supabase.from(...).select(...).eq(...).single()` etc. and those
// calls hit fetch under the hood.
//
// Auth is stubbed — Redesign is single-user local, there's no session
// to guard. We return a fake user + session so the existing
// "redirect to /admin if signed out" checks pass without rewiring.

// ─── Auth stubs ────────────────────────────────────────────────────

const LOCAL_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'local@redesign',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date(0).toISOString(),
}

const LOCAL_SESSION = {
  access_token: 'local-session',
  refresh_token: 'local-refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: LOCAL_USER,
}

const ok = <T>(data: T) => ({ data, error: null })

// ─── Query builder ─────────────────────────────────────────────────
//
// Every chain method returns `this` so long sequences like
//   .select('*').eq('id', x).single()
// accumulate state. The builder is also thenable — `await`ing it
// runs .execute() which builds the matching /api/... request.

type Filter = { col: string; val: unknown; op: 'eq' }
type Order  = { col: string; ascending: boolean }
type SingleMode = 'none' | 'single' | 'maybe'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Query implements PromiseLike<{ data: any; error: any }> {
  // Which table — determines the base URL (/api/posts vs /api/assets).
  private table: string
  // Op set by the last insert/update/delete call; defaults to select.
  private _op: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private _body: unknown = null
  // Filters — only `eq` is supported; that's all the editor uses.
  private _filters: Filter[] = []
  private _order?: Order
  // Tracks .single() / .maybeSingle() so the response is shaped right.
  private _single: SingleMode = 'none'

  constructor(table: string) { this.table = table }

  select(_cols: string = '*'): this {
    // `select` can appear BEFORE an op (filter + read) OR AFTER an
    // insert/update (return the row). Either way, the op stays what
    // it was; we just note that the caller wants the row back.
    return this
  }
  insert(body: unknown): this { this._op = 'insert'; this._body = body; return this }
  update(body: unknown): this { this._op = 'update'; this._body = body; return this }
  upsert(body: unknown): this { this._op = 'insert'; this._body = body; return this }
  delete(): this { this._op = 'delete'; return this }
  eq(col: string, val: unknown): this { this._filters.push({ col, val, op: 'eq' }); return this }
  // The editor only uses eq + order; these are no-ops that accept
  // whatever args so a stray call doesn't break the chain type.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  neq(..._args: any[]): this { return this }
  gt(..._args: any[]): this { return this }
  gte(..._args: any[]): this { return this }
  lt(..._args: any[]): this { return this }
  lte(..._args: any[]): this { return this }
  like(..._args: any[]): this { return this }
  ilike(..._args: any[]): this { return this }
  in(..._args: any[]): this { return this }
  contains(..._args: any[]): this { return this }
  is(..._args: any[]): this { return this }
  or(..._args: any[]): this { return this }
  range(..._args: any[]): this { return this }
  limit(..._args: any[]): this { return this }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  order(col: string, opts?: { ascending?: boolean }): this {
    this._order = { col, ascending: opts?.ascending ?? true }
    return this
  }
  single(): this { this._single = 'single'; return this }
  maybeSingle(): this { this._single = 'maybe'; return this }

  // Thenable → `await` triggers execute.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  then<TResult1 = { data: any; error: any }, TResult2 = never>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled ?? undefined, onrejected ?? undefined)
  }

  private baseUrl(): string | null {
    if (this.table === 'media_posts')  return '/api/posts'
    if (this.table === 'media_assets') return '/api/assets'
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async execute(): Promise<{ data: any; error: any }> {
    const base = this.baseUrl()
    if (!base) return fail(`unsupported table: ${this.table}`)
    const idFilter = this._filters.find((f) => f.col === 'id')?.val as string | undefined
    const expectedTs = this._filters.find((f) => f.col === 'updated_at')?.val as
      | string
      | undefined

    try {
      // ── SELECT ────────────────────────────────────────────────
      if (this._op === 'select') {
        if (idFilter) {
          const res = await fetch(`${base}/${idFilter}`)
          return await unwrap(res, this._single, { single: true })
        }
        const res = await fetch(base)
        return await unwrap(res, this._single, { single: false })
      }

      // ── INSERT ────────────────────────────────────────────────
      if (this._op === 'insert') {
        const res = await fetch(base, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this._body),
        })
        return await unwrap(res, this._single, { single: true })
      }

      // ── UPDATE ────────────────────────────────────────────────
      if (this._op === 'update') {
        if (!idFilter) return fail('update requires .eq("id", ...)')
        const payload: Record<string, unknown> = { patch: this._body }
        if (expectedTs) payload.expected_updated_at = expectedTs
        const res = await fetch(`${base}/${idFilter}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        // 409 = stale expected_updated_at. The editor's save path
        // does `.maybeSingle()` in that case and checks for `data == null`
        // to surface "edited elsewhere". Emulate that.
        if (res.status === 409 && this._single === 'maybe') {
          return { data: null, error: null }
        }
        return await unwrap(res, this._single, { single: true })
      }

      // ── DELETE ────────────────────────────────────────────────
      if (this._op === 'delete') {
        if (!idFilter) return fail('delete requires .eq("id", ...)')
        const res = await fetch(`${base}/${idFilter}`, { method: 'DELETE' })
        if (!res.ok) return fail(await res.text())
        return { data: null, error: null }
      }

      return fail(`unsupported op: ${this._op}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return fail(message)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function unwrap(
  res: Response,
  single: SingleMode,
  opts: { single: boolean },
): Promise<{ data: any; error: any }> {
  if (!res.ok) {
    const text = await res.text()
    return fail(text || `${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as unknown
  // For read-by-id / insert / update: always a single object.
  if (opts.single) return { data, error: null }
  // For list reads:
  //   - default (no .single/.maybeSingle): return the array as-is
  //   - .single(): first element or error if empty
  //   - .maybeSingle(): first element or null
  if (single === 'single') {
    const arr = data as unknown[]
    if (!arr.length) return fail('no rows returned')
    return { data: arr[0], error: null }
  }
  if (single === 'maybe') {
    const arr = data as unknown[]
    return { data: arr.length ? arr[0] : null, error: null }
  }
  return { data, error: null }
}

function fail(msg: string): { data: null; error: { message: string } } {
  return { data: null, error: { message: msg } }
}

// ─── Storage (the media-assets bucket) ─────────────────────────────

class StorageBucket {
  // bucket name as passed by the editor — we always translate to
  // the local "assets" bucket (exports aren't uploaded from the UI).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_bucket: string) {}

  async upload(
    path: string,
    bytes: Blob | ArrayBuffer | Uint8Array,
    _opts?: { cacheControl?: string; upsert?: boolean; contentType?: string },
  ): Promise<{ data: { path: string } | null; error: { message: string } | null }> {
    try {
      const form = new FormData()
      const blob =
        bytes instanceof Blob
          ? bytes
          : new Blob([bytes as ArrayBuffer], {
              type: _opts?.contentType ?? 'application/octet-stream',
            })
      form.append('file', blob, path.split('/').pop() ?? 'file')
      form.append('bucket', 'assets')
      form.append('path', path)
      const res = await fetch('/api/storage/upload', { method: 'POST', body: form })
      if (!res.ok) return { data: null, error: { message: await res.text() } }
      const saved = (await res.json()) as { storage_path: string }
      // Return only the in-bucket portion so callers that use `path`
      // later (getPublicUrl, storage_path column) see a consistent value.
      return { data: { path: stripBucketPrefix(saved.storage_path) }, error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return { data: null, error: { message } }
    }
  }

  async remove(_paths: string[]): Promise<{ data: unknown; error: null }> {
    // No-op in local mode. The asset DELETE route already removes the
    // blob; the editor sometimes calls .remove() AND deletes the row,
    // which under Supabase was also a no-op the second time.
    return { data: _paths, error: null }
  }

  getPublicUrl(path: string): { data: { publicUrl: string } } {
    const clean = stripBucketPrefix(path)
    return { data: { publicUrl: `/api/storage/assets/${clean}` } }
  }
}

function stripBucketPrefix(path: string): string {
  if (path.startsWith('assets/')) return path.slice('assets/'.length)
  if (path.startsWith('exports/')) return path.slice('exports/'.length)
  return path
}

// ─── Top-level client ──────────────────────────────────────────────

const client = {
  auth: {
    getUser:    async () => ok({ user: LOCAL_USER }),
    getSession: async () => ok({ session: LOCAL_SESSION }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut:    async () => ({ error: null }),
  },
  from: (table: string) => new Query(table),
  storage: {
    from: (bucket: string) => new StorageBucket(bucket),
  },
}

export const supabase = client as unknown as SupabaseLike
export function getSupabase():      SupabaseLike { return client as unknown as SupabaseLike }
export function getSupabaseAdmin(): SupabaseLike { return client as unknown as SupabaseLike }

type SupabaseLike = typeof client

// ─── Legacy row types — still referenced by other code surfaces ───

export type Lead = {
  id: string
  email: string
  name: string | null
  company: string | null
  phone: string | null
  lead_source: string
  lead_actions: string[]
  status: 'active' | 'discovery_scheduled' | 'lost' | 'unsubscribed' | 'diy'
  lost_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type LeadSubmission = {
  id: string
  email: string
  created_at: string
  sequence_step: number
  sequence_status: string
  last_step_at: string | null
}

export type ROISubmission = LeadSubmission & {
  task_type: string
  hours_per_week: string
  hourly_rate: string
  people_count: string
  judgment_level: string
  process_description: string
  time_before: number | null
  time_after: number | null
  monthly_savings_low: number | null
  monthly_savings_high: number | null
  yearly_savings_low: number | null
  yearly_savings_high: number | null
  automation_explanation: string | null
}

export type ContactSubmission = LeadSubmission & {
  name: string | null
  company: string | null
  phone: string | null
  message: string | null
}

export type LeadMagnetSubmission = LeadSubmission

export type FreeAutomationSubmission = {
  id: string
  email: string
  role: string | null
  task_type: string | null
  task_description: string | null
  tools: string | null
  linkedin_url: string | null
  created_at: string
  updated_at: string
}

export type LeadWithSubmissions = Lead & {
  roi_submissions: ROISubmission[]
  contact_submissions: ContactSubmission[]
  lead_magnet_submissions: LeadMagnetSubmission[]
  free_automation_submissions: FreeAutomationSubmission[]
}

export type Deal = {
  id: string
  email: string
  name: string | null
  company: string | null
  status:
    | 'discovery_scheduled'
    | 'discovery_completed'
    | 'diagram_sent'
    | 'diagram_approved'
    | 'proposal_sent'
    | 'negotiating'
    | 'won'
    | 'lost'
    | 'responded'
  deal_value: number | null
  lost_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type Post = {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  author: string
  reading_time: number | null
  tags: string[]
  draft: boolean
  created_at: string
  updated_at: string
  published_at: string | null
  meta_title: string | null
  focus_keyword: string | null
  charts: unknown[] | null
  pending_changes: Record<string, { before: unknown; after: unknown }> | null
}
