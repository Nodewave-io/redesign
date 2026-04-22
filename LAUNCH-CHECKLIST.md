# Redesign — launch checklist

Source of truth for "what's left before we ship". Read top to bottom;
each section lists what's done and what's not. Companion docs:

- [`README.md`](./README.md) — public-facing (thin, needs expansion before launch)
- [`HANDOFF.md`](./HANDOFF.md) — older handoff, kept for history
- [`../nw-site/docs/launch/business-plan.md`](../nw-site/docs/launch/business-plan.md) — why + business model
- [`../nw-site/docs/launch/landing-ui-design.md`](../nw-site/docs/launch/landing-ui-design.md) — landing page spec

Identifier we publish under: **`@nodewave/redesign`** on NPM, **`github.com/Nodewave-io/redesign`** on GH.
Palette: `#F5EFE6` cream bg / `#18120F` ink / `#F04E23` accent. Fonts Manrope + Space Mono.

---

## Current state (2026-04-22, end of last session)

**Shipped + verified:**
- SQLite backend at `~/.redesign/db.sqlite` — repo + file storage + smoke test (29 checks passing)
- 40 MCP tools implemented against SQLite; `src/mcp/index.ts` registers all 11 tool files; screenshot tools driven by lazy-Chromium launcher
- Editor at `web/` — full verbatim copy of the nw-site `/admin/media` tree, rewired to SQLite via:
  - `web/lib/supabase.ts` translator (chain calls → fetch)
  - `web/app/api/{posts,assets,storage}/...` routes using the vendored `web/lib/db/` module
- URL structure flattened: `/` posts, `/edit/[id]`, `/assets`, `/render/[postId]`
- Export + render wired to SQLite; puppeteer-core + `@puppeteer/browsers` auto-downloads Chrome into `~/.redesign/chromium/` on first use
- CLI: `redesign help / version / mcp / mcp-config / doctor / reset / init / seed / start` — `start` finds a free port (3000 → 3100 → 3200), writes `~/.redesign/config.json`
- `web/` build passes (`npm run build`, 8 routes, 102 kB shared JS)
- Design: Redesign palette live across all chrome; sidebar, panels, cards, buttons, focus rings on brand
- Canvas UX: dotted canvas bg (48px, scales with zoom), slides pan under floating panels, arrows anchor to slide edges + tint orange/grey by disabled state, zoom-reset button left of right panel
- Empty states: dashed placeholder cards, category dropdown (not wrapping pills)
- `.mcp.json` at `redesign/.mcp.json` — Claude Code picks it up on session start

**Known gaps / known broken:**
- Asset library is empty (wiped the 873 Figma icons — not premium, shouldn't ship)
- Showcase post not built yet — the real content of the launch
- `README.md` is one paragraph; no quickstart
- Nothing pushed to GitHub, nothing published to NPM
- Tarball `files` list not tuned — a `npm pack --dry-run` would include dev junk today
- Modal styling in `web/app/assets/page.tsx` (UploadModal + EditModal) + AssetCard still have hardcoded `rgba(15,18,17,X)` / `#0F1211` — see audit in §4

---

## 1. Build the showcase post (next session's main task)

**Why:** the landing page links to "posts made with Redesign." Zero posts = hollow pitch. We also grow the asset library from real usage, not a preemptive design sprint.

**How:**
1. Start fresh Claude Code session so the `redesign` MCP actually loads.
2. Have `npm run dev -- -p 3100` running in `web/` (or `node dist/cli.js start` once CLI is built). Port must match `~/.redesign/config.json`.
3. Paste the handoff prompt (saved at `HANDOFF.md` §"Handoff prompt for next session" — update it if the palette/URLs changed).
4. Build a 5-7 slide carousel ABOUT Redesign itself. Slide 1 hero, middle slides explain value/how it works, final slide is install CTA.
5. Every component you compose and like → `media_save_layer_as_asset` with real `usage_notes`.
6. Goal: one polished carousel + 5-10 reusable components in the shared library.

**Blockers this unblocks:** the "Showcase" section on the landing page (needs 3-6 carousels; we ship with 1 real one, add to it post-launch as users submit).

---

## 2. End-to-end smoke test on a fresh install

Before we publish, verify the whole install flow works from nothing. Do this ONCE on a machine with nothing in `~/.redesign/`:

```bash
# 0. Clean slate
rm -rf ~/.redesign

# 1. Build + pack locally
cd ~/Developer/nodewave/redesign
npm run build                   # builds dist/
cd web && npm run build && cd .. # builds web/.next
npm pack --dry-run              # audit tarball contents (§3)

# 2. Boot it
node dist/cli.js start
# Expect: port auto-selected (3000 → 3100 → 3200), editor URL printed,
# ~/.redesign/ created, ~/.redesign/db.sqlite bootstrapped

# 3. In browser: create a post, edit text, auto-save, click Download
# - First Download triggers Chrome install (~2 min, logs to stderr)
# - Subsequent downloads should be ~3s/slide

# 4. MCP verification
# In a separate terminal, echo | pipe into dist/mcp/index.js to check
# it speaks stdio (see HANDOFF.md smoke script) OR register in
# ~/.claude/mcp.json and restart Claude Code to call tools live
```

If any step fails, fix before publish.

---

## 3. Tune the NPM tarball (`files` + `.npmignore`)

`package.json` currently has a `files` field but hasn't been audited against what actually ships. Must include:

- `dist/` (compiled CLI + MCP + db + seed)
- `web/.next/` (pre-built Next bundle — see `.next/standalone` output if using standalone)
- `web/app/`, `web/components/`, `web/lib/`, `web/public/` (Next runtime needs these even with a build)
- `web/package.json`, `web/next.config.mjs`
- `schema/0001_init.sql` (DB bootstrap fallback if the inlined `web/lib/db/schema.ts` somehow drifts)
- `README.md`, `LICENSE`

Must NOT include:
- `seed/icons/` (already deleted) — but if we ship starter components later, include that specific folder only
- `scripts/` (dev-only)
- `web/node_modules/`, `web/.next/cache/`
- `.mcp.json` (user-specific), `HANDOFF.md`, `LAUNCH-CHECKLIST.md` (dev docs)
- Test files, `.git`, etc.

Run `npm pack --dry-run` and eyeball the file list. Expected tarball size: 15-30 MB (mostly the .next build + node_modules transient deps resolved). If > 50 MB something's leaking.

---

## 4. Visual audit — hardcoded color leaks

Found in last session but not all fixed. Grep:

```bash
cd web
grep -rn "#FFFFFF\|#0F1211\|#FAFAFA\|rgba(15,18,17" app components
```

Legit remaining: white text on the orange primary button (4 call sites — keep).

Still needs tokenization:
- `app/assets/page.tsx` — `UploadModal` + `EditModal` + `AssetCard` inline styles
- Any `border: '1px solid rgba(15,18,17,0.X)'` (old ink, the new ink is `rgba(24,18,15,X)`)

30-min find/replace pass. Low visual impact today, matters if we ever tweak palette.

---

## 5. Write the README + quickstart docs

Current `README.md` is one paragraph — landing page CTAs point users there and we have nothing. Must cover:

1. **What it is** — one paragraph pitch (steal from landing hero).
2. **Install** — the `npx @nodewave/redesign start` one-liner, what it does, what gets created in `~/.redesign/`.
3. **Connect Claude Code** — the `.mcp.json` snippet (`redesign mcp-config` prints it) + restart note.
4. **First post walkthrough** — 30 seconds: create, talk to Claude, export.
5. **Requirements** — Node 20+, Claude Code, first run downloads Chrome ~200 MB.
6. **Commands** — `doctor`, `reset`, `seed`, `mcp`, `init`.
7. **Data location + privacy** — everything's in `~/.redesign/`, nothing leaves your machine.
8. **Contributing / license** — MIT + link to GitHub issues.

~200-300 lines. Ship in one pass.

---

## 6. Git + NPM publish

**GitHub** (repo created at `github.com/Nodewave-io/redesign`):

```bash
cd ~/Developer/nodewave/redesign
git remote add origin git@github.com:Nodewave-io/redesign.git
git push -u origin main
```

All local commits push in one shot. Repo goes public when you flip the toggle on GitHub.

**NPM** (Tiago already ran `npm login`):

```bash
# Dry run first — confirms tarball contents + package name
npm publish --dry-run

# For real — ship as 0.1.0 stable (or 0.1.0-beta.1 if you want a soft launch)
npm publish --access public
```

Bump `version` in `package.json` from `0.1.0-pre` to `0.1.0` (or chosen tag) before publishing. First publish of a scoped package needs `--access public` or NPM assumes private.

---

## 7. Landing page final link-up

The landing at `nw-site/app/redesign/page.tsx` references:
- `github.com/Nodewave-io/redesign` — fine, already the case
- `npx @nodewave/redesign start` — fine, matches the CLI
- Demo video slot — not recorded yet (Tiago task, optional for launch)
- Showcase carousels — from §1, we'll have 1 real one

Once GitHub + NPM are live, verify these still resolve (the star button fetch etc).

---

## 8. Nice-to-have / post-launch

Not blockers. Keep the launch tight:

- **Delete unused files** — `src/tokens/` (superseded by `_styles.css`), `src/seed.ts` only if we decide no user will bulk-import their own icon library
- **The "4 Issues" Next overlay** — Tiago flagged; investigate in the running dev server (click the bubble, list them, patch)
- **Starter components** — once the showcase is done, package the reusable pieces as a `seed/components/` bundle that `redesign seed --components` imports
- **Docs site upgrade** — Starlight or Nextra for search; GH markdown is fine for launch
- **Discord / community** — hold until traction justifies it

---

## Summary for the next session

**Do in this order:**
1. Build the showcase post (§1)
2. Smoke-test the full install flow (§2)
3. Tune the tarball (§3)
4. Audit colors (§4)
5. Write the README (§5)
6. Push to GitHub + publish to NPM (§6)
7. Verify the landing (§7)

Steps 1-5 can parallelize. Steps 6-7 are launch-day.

When all seven are green, ship.
