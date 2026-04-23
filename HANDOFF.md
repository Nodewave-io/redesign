# Redesign — migration handoff

State as of 2026-04-22 (lunch session, round 2). For the next Claude
session that picks up the editor copy + web routes + landing
integration. Pair this with:

- [`docs/launch/business-plan.md`](../nw-site/docs/launch/business-plan.md) — why + what
- [`docs/launch/landing-ui-design.md`](../nw-site/docs/launch/landing-ui-design.md) — landing page spec
- [`~/.claude/infrastructure/media-builder.md`](~/.claude/infrastructure/media-builder.md) — editor architecture
- [`~/.claude/infrastructure/media-mcp.md`](~/.claude/infrastructure/media-mcp.md) — MCP tool surface

## What's done in this package

```
redesign/
├── package.json           name=@nodewave-io/redesign, MIT, bin=redesign
├── tsconfig.json          NodeNext, strict
├── LICENSE                MIT
├── README.md              user-facing
├── HANDOFF.md             this file
├── schema/
│   └── 0001_init.sql      media_posts, media_assets, media_post_revisions,
│                          media_mcp_log — mirror of Supabase schema,
│                          with touch + 30-cap trim triggers
├── scripts/
│   └── smoke.ts           29-check end-to-end suite (db + mcp pipeline)
└── src/
    ├── types.d.ts         ambient shims for optional peer deps
    │                      (puppeteer, @babel/standalone)
    ├── cli.ts             CLI entry: help / version / mcp / mcp-config /
    │                      doctor / reset / init / start (stub)
    ├── db/
    │   ├── paths.ts       ~/.redesign/{db.sqlite,assets,exports,logs}
    │   ├── client.ts      singleton better-sqlite3, auto-bootstraps
    │   ├── types.ts       domain types
    │   ├── repo.ts        typed CRUD, optimistic concurrency, monotonic
    │   │                  updated_at, auto page_count/slides sync
    │   ├── storage.ts     fs save/remove with path-traversal guards
    │   └── init.ts        standalone `npm run db:init` bootstrap
    ├── mcp/
    │   ├── index.ts       stdio server entry, registers 11 tool files
    │   ├── log.ts         withLogging wrapper (uses repo.insertMcpLog)
    │   ├── write-helpers.ts  applyWrite: fetch → snapshot → mutate → commit
    │   ├── batch.ts       applyBatch + applyAlign + applyDistribute
    │   ├── schemas.ts     zod: layerInput, layerPatch, themeSchema
    │   └── tools/
    │       ├── posts-read.ts     list/get/describe (3 tools)
    │       ├── posts-write.ts    create/update/set_page_count/
    │       │                     set_slide_background/delete (5 tools)
    │       ├── layers-write.ts   add/add_from_asset/update/set_code_source/
    │       │                     remove/move_z (6 tools)
    │       ├── batch-write.ts    apply_batch/remove_layers/update_layers/
    │       │                     align/distribute (5 tools)
    │       ├── assets-read.ts    list/get/search (3 tools)
    │       ├── asset-curate.ts   create_component/save_layer/update/
    │       │                     delete (4 tools)
    │       ├── uploads.ts        upload_from_url/screenshot_url (2 tools)
    │       ├── revisions.ts      list/get/revert_to (3 tools)
    │       ├── inspect.ts        alignment/overlaps/bounds/compare/
    │       │                     text_metrics/validate_layout (6 tools)
    │       ├── validate.ts       validate_code (1 tool)
    │       └── screenshot.ts     STUB — throws until web/ is ported
    └── tokens/
        ├── index.ts            design tokens (color/radius/space/
        │                       fontStack/fontSize/motion/shadow/
        │                       breakpoint). Accent = PLACEHOLDER,
        │                       locked once v4 landing picks final.
        └── tailwind-preset.ts  preset the editor's tailwind.config
                                consumes so tokens stay unified
```

**38 of 40 MCP tools are fully ported.** The two screenshot tools are
registered but throw a friendly "not yet available" error — they need
the Next editor + a puppeteer Chromium resolver, which lands with the
editor copy.

### Verification

```bash
cd ~/Developer/nodewave/redesign
npm install
npm run typecheck          # clean
npx tsx scripts/smoke.ts   # 29/29 checks pass — db CRUD, optimistic
                           # concurrency, revisions, asset + file
                           # storage, MCP applyWrite + applyBatch
                           # (including in-batch UUID references)
npx tsx src/cli.ts doctor  # all 3 env checks pass
npx tsx src/cli.ts mcp-config  # prints pasteable .mcp.json snippet
```

## What's NOT done (next session, in this order)

### 1. Editor port — est. 4-6 hr

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

**Restyle note:** do NOT re-derive the editor's visual identity. Consume
`src/tokens/index.ts` (and, for Tailwind, `src/tokens/tailwind-preset.ts`).
The `color.accent` value is PLACEHOLDER (v1's `#FF5A1F`); Tiago's v4
landing will lock it — update the token, and the editor inherits.

### 2. Screenshot tools — est. 1-2 hr (after editor ports)

`src/mcp/tools/screenshot.ts` is a stub. Once the editor lives at
`redesign/web/` serving a `/render/<postId>/<slideIndex>` route, the
real impl is:
- Launch puppeteer (resolved from bundled Chromium or BYOC path)
- `page.goto('http://127.0.0.1:<port>/render/...')`
- `page.screenshot({ type, quality, fullPage: false })`
- Return `{ type: 'image', data: base64, mimeType }`

Both `media_screenshot` and `media_screenshot_strip` land here.

### 3. Auth removal — est. 30 min

Rip out of the copied editor:
- `supabase.auth.getUser()` calls (just assume user is present)
- `/admin` redirect logic
- `useEffect` that polls session

In the CLI entry we can optionally print a warning if the process
isn't bound to `127.0.0.1` only.

### 4. CLI `start` — est. 1 hr

The CLI skeleton exists and most commands work. Only `redesign start`
is a stub — it prints a friendly "not yet available" message. Once
`web/` lands, flesh it out:
- Spawn `next start` (prod) or `next dev` (when `--dev`) against `web/`
- Pipe stderr/stdout so Ctrl-C exits cleanly
- Print the mcp-config snippet + a "paste this into ~/.claude/mcp.json" hint
- Open the browser if stdout is a TTY

### 5. Polish before publish — est. 2-3 hr

- [ ] Seed 20 starter component assets via `redesign seed`
- [ ] `npm pack` dry-run, check tarball contents
- [ ] Publish as `@nodewave-io/redesign@0.1.0` (scope already locked in
      `package.json`)
- [ ] Mirror repo to `github.com/Nodewave-io/redesign`

## What's NEW in this round (vs. the previous handoff)

- Full MCP port: 38/40 tools live under `src/mcp/tools/`, registered
  in `src/mcp/index.ts`. Screenshot tools stubbed pending editor.
- `src/tokens/` — design token single source of truth + Tailwind
  preset. Placeholder accent, v4 landing will lock it.
- `src/cli.ts` — working commands: help, version, mcp, mcp-config,
  doctor, reset, init. `start` is a stub.
- `src/types.d.ts` — ambient shims so typecheck passes without the
  optional peer deps.
- Smoke test extended from 22 → 29 checks (adds applyWrite,
  applyBatch, in-batch UUID references, stale-expected rejection,
  revision creation).
- Bug fixes: (1) `createPost({ page_count })` now auto-generates
  matching blank slides instead of leaving slides out of sync;
  (2) `updatePost` now issues a timestamp strictly greater than both
  the previous issue AND the row's current value — prevents same-ms
  collisions between SQLite defaults and JS Date.now.

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

When `npx @nodewave-io/redesign start` works end-to-end on a fresh Mac
with only Node 20+ and Claude Code installed, section 8.1 of the
business plan is done.
