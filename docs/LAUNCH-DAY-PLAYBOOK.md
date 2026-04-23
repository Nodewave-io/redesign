# Launch-day playbook for `@nodewave/redesign` v0.1.0

You (Claude) are the orchestrator for taking this package to public release. Tiago (the user) is non-technical — he depends on you for every command and decision.

This doc is the entire blueprint. Read it top-to-bottom before doing anything else, then execute the phases in order.

## What you're shipping

`@nodewave/redesign` is a local-first CLI + MCP server + Next.js editor that lets a user (with Claude Code) build LinkedIn / Instagram carousels by talking to Claude. Everything runs on the user's machine. SQLite at `~/.redesign/db.sqlite`. No cloud accounts, no telemetry.

- **NPM scope:** `@nodewave/redesign` (lowercase, npm convention)
- **GitHub:** `github.com/Nodewave-io/redesign` (case-sensitive)
- **Repo on disk:** `/Users/nodewave/Developer/nodewave/redesign/`
- **Editor lives in disk repo:** `web/` (Next.js, App Router)
- **CLI + MCP server source:** `src/` (TypeScript, builds to `dist/`)
- **Schema:** `schema/0001_init.sql` + the in-code copy at `web/lib/db/schema.ts`

## Read these first (don't summarize for Tiago, just absorb context)

1. `README.md` — public-facing pitch + install instructions
2. `LAUNCH-CHECKLIST.md` — running tally of what's shipped vs pending. Some items there are stale (we did most of them yesterday); confirm against current state, don't trust blindly
3. `SECURITY.md` — threat model + what's defended vs deferred
4. `package.json` — confirm version is `0.1.0` (not `0.1.0-pre`), confirm `files` list, scripts
5. `docs/FRESH-SESSION-TESTS.md` — the prompts we use to validate the MCP from cold
6. `~/.claude/infrastructure/macbook-remote-debug.md` — read if you need to inspect the editor in a real browser via CDP. Already-open debug Chrome may be on `localhost:9223` — try `curl -s http://localhost:9223/json/version` to check
7. `~/.claude/infrastructure/media-builder.md` and `media-mcp.md` — architecture notes for the editor + MCP

You can read any source file directly. Don't ask Tiago to summarize the codebase — read it.

## State of the world (as of 2026-04-23 evening)

**Done yesterday:**
- All blocker bug fixes (preview empty, 409 rename race, canvas centering, font dropdown, etc.)
- Security review + fixes: SSRF allowlist on URL-fetch MCP tools, CSS injection sanitizer on image-layer URLs, install-mcp atomic write + 0600 perms, dev-fallback `next start -H 127.0.0.1`, schema trigger excludes thumbnail-only updates, etc.
- `redesign install-mcp` command (auto-merges entry into `~/.claude/mcp.json`)
- CLI defaults to `start` when no subcommand given (`npx @nodewave/redesign` boots editor)
- Geist + System (SF Pro) fonts added to text layers
- Live-sync polling in editor (1s, refetches when `updated_at` advances and no local edits pending)
- Component preview pipeline: native dimensions (asset.width × asset.height), contain-fit × 0.86 margin, auto-detected light/dark backdrop
- Asset import respects native dimensions (no stretching to full canvas)
- Strip clips overflow (editor matches export visually)
- Parallel-pages export (3-5x faster, concurrency=4)
- Chrome pre-warm on `start` (fire-and-forget background download)
- 7 Cloudtech 3D icons + 9 component assets (charts, cards, pills, etc.) seeded in Tiago's local DB

**Done today (2026-04-23):**
- Showcase post complete — 5-slide carousel for the launch (post id `7d87bc1b-...`). Used as the primary proof-of-tool on the landing page.
- Donut + line chart components saved into the asset library with native dims (760×720 / 880×600), under categories `components, charts`.
- All 9 existing component assets back-filled with native `width`/`height` (Stat/Quote/Badge/Bar 260×180, Install pill 840×130, Numbered step row 860×48, Eyebrow tag 500×40).
- MCP asset tools upgraded:
  - `media_save_layer_as_asset` now auto-saves the layer's `w`/`h` as native dimensions (no Claude action required).
  - `media_create_component_asset` accepts optional `width` + `height` with strong description guidance (examples for pills, cards, charts).
  - `media_update_asset` patches now accept `width`, `height`, `source_code` (so existing assets can be retro-dimensioned, source typos fixed).
- Repo `AssetPatch` types updated in both `src/db/repo.ts` and `web/lib/db/repo.ts` to handle the new fields.

**Tarball was last verified yesterday at 21 MB / 2918 files.** Today's source changes (MCP tool updates) need a fresh `npm run build:all` + `npm pack --dry-run` in Phase 1 to confirm the tarball is still healthy.

**Git remote:** `origin` is set to `git@github.com:Nodewave-io/redesign.git`. Nothing pushed yet.

## What you're doing today

Six phases, in this order. Don't skip ahead.

### Phase 1 — Sanity check the working tree (5 min)

1. `cd ~/Developer/nodewave/redesign`
2. `git status -s` — expect ~30 modified + ~7 new files. Capture this.
3. `git log --oneline -5` — note the most recent commits.
4. Verify `package.json` has `"version": "0.1.0"` (NOT `-pre`).
5. Run `npm run typecheck` — should be clean.
6. Run `npm run build:all` — should produce a clean `dist/` and `web/.next/standalone/`. If anything errors, stop and tell Tiago.
7. Run `npm pack --dry-run` and read the file count + size. Expected: ~2918 files, ~21 MB. Anything wildly different = stop and investigate.

If any step fails, fix or escalate before proceeding.

### Phase 2 — npm audit + dependency freshness (5 min)

```bash
npm audit
cd web && npm audit && cd ..
```

If anything HIGH or CRITICAL appears, stop. Look at the offending package and decide whether to bump it or accept the risk. Don't ship with an unaddressed HIGH.

### Phase 3 — End-to-end install simulation (15 min)

Goal: prove that a stranger doing `npx @nodewave/redesign install-mcp && npx @nodewave/redesign` from a fresh terminal would get a working setup.

This isn't testing the running dev server — it's testing the **published tarball flow**.

1. Pack a tarball into `/tmp`:
   ```bash
   rm -rf /tmp/redesign-launch-final && mkdir -p /tmp/redesign-launch-final
   cd ~/Developer/nodewave/redesign
   npm pack --pack-destination /tmp/redesign-launch-final
   ```

2. Install it in an isolated dir (no leakage from the dev repo):
   ```bash
   mkdir -p /tmp/redesign-launch-final/install
   cd /tmp/redesign-launch-final/install
   npm init -y > /dev/null
   npm install /tmp/redesign-launch-final/nodewave-redesign-0.1.0.tgz
   ```

3. Run the bin against an isolated home (don't touch `~/.redesign` which has Tiago's real data):
   ```bash
   export REDESIGN_HOME=/tmp/redesign-launch-final/home
   ./node_modules/.bin/redesign version       # → 0.1.0
   ./node_modules/.bin/redesign doctor        # → all checks pass
   ```

4. Test install-mcp against an isolated `~/.claude` (don't touch Tiago's real config):
   ```bash
   HOME=/tmp/redesign-launch-final/claude ./node_modules/.bin/redesign install-mcp
   cat /tmp/redesign-launch-final/claude/.claude/mcp.json   # confirm entry was added
   ls -la /tmp/redesign-launch-final/claude/.claude/mcp.json # confirm mode is -rw------- (0600)
   ```

5. Boot the standalone server on a non-conflicting port:
   ```bash
   REDESIGN_HOME=/tmp/redesign-launch-final/home \
     ./node_modules/.bin/redesign start --port 3550 > /tmp/launch-server.log 2>&1 &
   ```

6. After ~5s, hit the API:
   ```bash
   curl -s http://127.0.0.1:3550/api/posts                  # → []
   curl -s -X POST http://127.0.0.1:3550/api/posts \
     -H "Content-Type: application/json" \
     -d '{"title":"E2E test","page_count":2,"theme":"dark","slides":{"slides":[{"id":"s0"},{"id":"s1"}],"layers":[]}}'
   curl -s http://127.0.0.1:3550/api/posts                  # → array with 1 post
   ```

7. Stop the server (`kill -INT <pid>`).

If ANY step in this phase fails, **stop and report to Tiago** — this means an end user would also fail, and the package isn't ready to publish.

### Phase 4 — Fresh-Claude-Code MCP test (15 min)

Goal: prove that when a brand-new Claude Code session connects to the redesign MCP, it can drive the editor.

You can spawn fresh Claude Code subprocesses non-interactively with:
```bash
claude -p "<prompt>" \
  --mcp-config /Users/nodewave/Developer/nodewave/redesign/.mcp.json \
  --allowedTools "mcp__redesign__*" \
  > /tmp/fresh-claude-out.txt 2>&1
```

Run THREE prompts in parallel (each in a backgrounded shell), capturing stdout. Each should complete in 1-3 minutes:

**Prompt A — read-only audit:**
> "You have access to a `redesign` MCP server. Without modifying anything: list all posts, list all assets, search assets for 'chart'. Report back: tool names you called, any descriptions that confused you, did anything fail. Under 150 words."

**Prompt B — write end-to-end:**
> "Create a 2-slide post titled 'Launch test' (dark theme). Add a text layer to slide 0 saying 'Hello world' (large font, centered). Use `media_apply_batch` to do it in one call. Then call `media_screenshot` on slide 0 and confirm visually it looks right. Report tools used + any failures. Under 200 words."

**Prompt C — asset library use:**
> "Find a chart component in the asset library. Get its source. Report the asset's name, its native width/height (look at the asset's `width`/`height` fields), and the first 100 chars of its source. Don't modify anything. Under 100 words."

Read the captured outputs. Look for:
- ❌ Any tool call that 404s, 500s, or returns a stale-token error → real bug, escalate
- ⚠ Any "I had to guess this argument" or "the description didn't say X" → MCP UX issue, log for v0.2
- ✓ Clean execution → MCP is launch-ready

### Phase 5 — Final security re-audit (10 min)

Spawn an agent with this prompt (use `general-purpose` subagent type):

> "Read SECURITY.md in `/Users/nodewave/Developer/nodewave/redesign/`. Then verify the documented mitigations are still in place by reading the actual code. Specifically check: (1) `src/mcp/tools/uploads.ts` SSRF guard `assertPublicHttpUrl` blocks file:// + RFC1918 + 169.254.169.254. (2) `web/lib/db/storage.ts` `resolveStoragePath` rejects `..` and absolute paths. (3) `web/app/_lib/render.tsx` `sanitizeImageUrl` escapes CSS `url(\"...\")` content. (4) `src/cli.ts` `runInstallMcp` writes via tmpfile+rename with mode 0600. (5) `src/cli.ts` `runStart` passes `HOSTNAME=127.0.0.1` (standalone) and `-H 127.0.0.1` (dev fallback). For each: PASS / FAIL with file:line. Cap at 200 words."

If any FAIL: stop and fix before publishing.

### Phase 6 — Pre-publish housekeeping (10 min)

1. Update `LAUNCH-CHECKLIST.md`: mark items 1-5 done, items 6-7 ready to fire. Don't bloat — turn it into a "next session" doc.
2. Draft a GitHub release notes file at `docs/RELEASE-NOTES-v0.1.0.md` — bullet list of features + links to relevant files. Tiago will paste this into the GitHub release UI later. ~150 words.
3. Stage all the changes for commit. **DON'T commit yet** — just verify the diff is sane:
   ```bash
   git status -s
   git diff --stat
   ```

### Hand-off to Tiago

Once Phases 1-6 are green, give Tiago this exact list to execute himself (he has 2FA on npm + GitHub access):

1. **Commit + tag:**
   ```bash
   cd ~/Developer/nodewave/redesign
   git add .
   git commit -m "v0.1.0 launch"
   git tag v0.1.0
   ```

2. **Push to GitHub** (triggers nothing, just stores the source):
   ```bash
   git push -u origin main
   git push --tags
   ```

3. **Create the GitHub release** in the UI (paste from `docs/RELEASE-NOTES-v0.1.0.md`).

4. **Publish to npm** with provenance (cryptographic supply-chain proof linking the tarball to the GitHub commit):
   ```bash
   npm publish --access public --provenance
   ```
   - First time publishing a scoped package needs `--access public` (otherwise npm assumes private = paid plan).
   - `--provenance` requires GitHub Actions OR npm being authed via OIDC. If it errors, fall back to `npm publish --access public` and add provenance in v0.1.1 once we wire up Actions.

5. **Live smoke test the published package** from a fresh terminal:
   ```bash
   cd /tmp && rm -rf publish-test && mkdir publish-test && cd publish-test
   npx @nodewave/redesign install-mcp
   npx @nodewave/redesign
   ```
   Confirm the editor opens at the printed URL.

6. **Verify the landing page** (already deployed): the install command + GitHub link + star count fetch should all resolve correctly now that the package + repo are public.

## Things to NOT do

- **Don't run `npm publish` yourself** — that's Tiago's call, his account, his provenance.
- **Don't push to GitHub yourself** — same reason. Set up the commit so it's one command for Tiago.
- **Don't modify `~/.redesign/` or `~/.claude/mcp.json`** during testing — use isolated paths under `/tmp/redesign-launch-final/`. Tiago is using his real data + config in the running editor.
- **Don't kill any process you didn't start.** Tiago's editor is probably running on port 3000. Leave it alone.
- **Don't promote to production / Vercel anywhere** — the landing site lives in `nw-site/` which has its own deploy flow. Tiago handles that.

## When in doubt

Ask Tiago. He's at the keyboard and faster to clarify than you are to dig through context. Specifically: ambiguous test failures, anything that touches his real DB or real `~/.claude` config, anything destructive.

## Success criteria

- All 6 phases green
- Hand-off list given to Tiago, ready for him to execute
- Release notes + updated checklist committed (but not pushed) by you
- A clear "go" signal: "Phases 1-6 pass. You're cleared to commit, push, and publish in that order. Run the live smoke test after publish to confirm."
