# Redesign — migration handoff

State as of 2026-04-22. For the next Claude session that picks up
the SQLite migration and public launch. Pair this with:

- [`docs/launch/business-plan.md`](../nw-site/docs/launch/business-plan.md) — why + what
- [`docs/launch/landing-ui-design.md`](../nw-site/docs/launch/landing-ui-design.md) — landing page spec
- [`~/.claude/infrastructure/media-builder.md`](~/.claude/infrastructure/media-builder.md) — editor architecture
- [`~/.claude/infrastructure/media-mcp.md`](~/.claude/infrastructure/media-mcp.md) — MCP tool surface

## What's done in this package

```
redesign/
├── package.json           name=@nodewave/redesign, MIT, bin=redesign
├── tsconfig.json          NodeNext, strict
├── LICENSE                MIT
├── README.md              user-facing
├── HANDOFF.md             this file
├── schema/
│   └── 0001_init.sql      media_posts, media_assets, media_post_revisions,
│                          media_mcp_log — mirror of Supabase schema, with
│                          a touch trigger on media_posts and a trim
│                          trigger on media_post_revisions (cap 30)
└── src/
    └── db/
        ├── paths.ts       ~/.redesign/{db.sqlite,assets,exports,logs}
        ├── client.ts      singleton better-sqlite3, bootstraps schema on first boot
        ├── types.ts       domain types (Layer, MediaPost, MediaAsset, …)
        ├── repo.ts        repository fns: listPosts/getPost/createPost/
        │                  updatePost (with optimistic concurrency)/deletePost,
        │                  revisions CRUD, assets CRUD, mcp log insert
        ├── storage.ts     fs save/remove for asset + export blobs, with
        │                  path-traversal guards
        └── init.ts        `npm run db:init` — bootstrap + print table list
```

Everything in `src/db/` is synchronous, typed, and has no dependency
on Supabase. Already tested: `npx tsx scripts/smoke.ts` runs a 22-check
end-to-end suite (posts CRUD, optimistic concurrency, revisions,
assets, file storage, mcp log) against a disposable DB in `/tmp/`.
All 22 pass on the author's Mac.

Run `npm i && npm run typecheck && npx tsx scripts/smoke.ts` to
reproduce.

## What's NOT done (next session, in this order)

### 1. MCP port — est. 4-6 hr

Source lives at `nw-site/mcp/src/`. For each tool file under
`src/tools/`, write the equivalent that imports from `@nodewave/redesign/db`:

- [ ] `posts-read.ts`   → `listPosts`, `getPost`, + describe helper
- [ ] `posts-write.ts`  → `createPost`, `updatePost`, `deletePost`
- [ ] `layers-write.ts` → `updatePost` with layer-level patches
- [ ] `batch-write.ts`  → keep batch.ts helper verbatim; swap the save call
- [ ] `assets-read.ts`  → `listAssets`, `getAsset`
- [ ] `asset-curate.ts` → `createAsset`, `updateAsset`, `deleteAsset` +
                          `removeStoredFile` for images
- [ ] `uploads.ts`      → `saveAssetBytes`
- [ ] `revisions.ts`    → `listRevisions`, `getRevision`, `createRevision`
- [ ] `inspect.ts`      → pure geometry; swap only the fetch call
- [ ] `validate.ts`     → pure; copy verbatim
- [ ] `screenshot.ts`   → the puppeteer path still works, just point it
                          at a renderer that reads from SQLite instead
                          of a Supabase URL

The `withLogging` wrapper in `log.ts` stays conceptually identical,
just swap `supabase.from('media_mcp_log').insert(row)` for
`insertMcpLog(row)` from `src/db/repo.ts`.

### 2. Editor port — est. 4-6 hr

The Next editor lives at `nw-site/app/admin/media/`. Two options:

**A. Copy into `redesign/web/`** and rewire DB calls to new API routes.
This is the cleanest for a standalone package.

**B. Keep it in nw-site** and ship only the MCP + a CLI that connects
to a running nw-site on localhost. This is faster but means users
need a full nw-site clone.

Recommendation: **A**. The editor + MCP belong together.

Editor files that hit Supabase (grepped):
- `app/admin/media/page.tsx` — list, create, delete, download
- `app/admin/media/edit/[id]/page.tsx` — get, update (auto-save)
- `app/admin/media/assets/page.tsx` — asset CRUD
- `app/admin/media/render/[postId]/page.tsx` — render endpoint
- `app/admin/media/_components/LeftPanel.tsx` — asset picker
- `app/api/media/export/route.ts` — export pipeline
- `app/api/media/render-data/route.ts` — feeds puppeteer

Each `supabase.from('x').y()` call becomes either a repo call (when in
a Next API route / server component) or a `fetch('/api/...')` call
(when in a client component).

Routes to add under `redesign/web/app/api/`:
- `posts/route.ts`                 — GET list, POST create
- `posts/[id]/route.ts`            — GET, PATCH, DELETE
- `assets/route.ts`                — GET list, POST create-component
- `assets/[id]/route.ts`           — GET, PATCH, DELETE
- `assets/upload/route.ts`         — multipart → `saveAssetBytes`
- `storage/[bucket]/[name]/route.ts` — GET file bytes, content-type set
- `revisions/[postId]/route.ts`    — GET list, POST snapshot
- `export/route.ts`                — existing export pipeline, unchanged
                                     logic, storage layer swapped

### 3. Auth removal — est. 30 min

Rip out of the copied editor:
- `supabase.auth.getUser()` calls (just assume user is present)
- `/admin` redirect logic
- `useEffect` that polls session

In the CLI entry we can optionally print a warning if the process
isn't bound to `127.0.0.1` only.

### 4. CLI — est. 2-3 hr

`src/cli.ts`:

```
redesign start               # default: dev server on :3000
redesign start --port 4000
redesign doctor              # checks node version, sqlite, permissions
redesign mcp-config          # prints the .mcp.json snippet to paste
redesign reset --yes         # deletes ~/.redesign/  (asks confirm unless --yes)
```

`start` spawns `next start` on the bundled `web/` build. `mcp-config`
prints:

```json
{
  "mcpServers": {
    "redesign": {
      "command": "npx",
      "args": ["@nodewave/redesign", "mcp"]
    }
  }
}
```

### 5. Polish before publish — est. 2-3 hr

- [ ] Seed 20 starter component assets via `redesign seed`
- [ ] `npm pack` dry-run, check tarball contents
- [ ] Publish as `@nodewave/redesign@0.1.0` (scope already locked in
      `package.json`)
- [ ] Mirror repo to `github.com/Nodewave/redesign`

## Design notes / gotchas

- **Optimistic concurrency**: `updatePost(id, patch, expected_updated_at)`
  throws `StaleUpdateError` when the row has moved on. The MCP
  tool layer should catch and format that as a user-readable error.

- **JSON columns**: `slides`, `categories`, `tags` are stringified in
  `repo.ts` write paths and parsed on read. Callers never see raw JSON.

- **better-sqlite3 is sync**: every DB call blocks the event loop.
  That's fine for a local single-user app. Don't try to retrofit it
  with async wrappers — it only hurts perf + readability.

- **WAL mode is set in schema**: don't also set it from app code. If
  you need to disable WAL for some reason (e.g. running on a
  network-mounted filesystem), do it in one place via `PRAGMA journal_mode`.

- **Path safety in storage.ts**: `resolveStoragePath` rejects `..`
  and absolute paths. Keep it that way. Any bucket you add (e.g.
  "thumbnails") needs to be allow-listed in that function.

## Success criterion

From the business plan: *"If a stranger can type one command and
have Redesign running in under 2 minutes, we win."*

When `npx @nodewave/redesign start` works end-to-end on a fresh Mac
with only Node 20+ and Claude Code installed, section 8.1 of the
business plan is done.
