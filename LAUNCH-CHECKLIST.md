# Redesign — launch checklist

Ship state for `@nodewave/redesign` v0.1.0. Tiago executes §6–§7 manually (his npm + GitHub creds).

- NPM: **`@nodewave/redesign`**
- GitHub: **`github.com/Nodewave-io/redesign`**
- Local repo: `~/Developer/nodewave/redesign`

---

## Pre-ship verification (2026-04-23)

All six phases in [`docs/LAUNCH-DAY-PLAYBOOK.md`](./docs/LAUNCH-DAY-PLAYBOOK.md) green:

1. ✅ **Working tree sane** — version `0.1.0`, typecheck clean, `build:all` clean, `npm pack --dry-run` = 21.9 MB / 2918 files.
2. ✅ **npm audit** — 0 vulnerabilities in root + `web/`.
3. ✅ **Install simulation** — fresh tarball into `/tmp`, `redesign version`, `doctor`, `install-mcp` (0600 perms), `start --port 3550`, API create+list all pass.
4. ✅ **Fresh Claude Code MCP** — three subprocess prompts (read audit, write+screenshot, asset library fetch) all completed cleanly against isolated snapshot of Tiago's DB.
5. ✅ **Security re-audit** — `assertPublicHttpUrl`, `resolveStoragePath`, `sanitizeImageUrl`, `runInstallMcp` tmpfile+0600, `runStart` 127.0.0.1 binding all verified against current code.
6. ✅ **Housekeeping** — this doc updated, release notes drafted at [`docs/RELEASE-NOTES-v0.1.0.md`](./docs/RELEASE-NOTES-v0.1.0.md), diff staged.

---

## §7 — Tiago's hand-off checklist (execute in order)

```bash
cd ~/Developer/nodewave/redesign

# 1. Commit + tag
git add .
git commit -m "v0.1.0 launch"
git tag v0.1.0

# 2. Push source
git push -u origin main
git push --tags

# 3. Create GitHub release in the UI
#    Body: paste from docs/RELEASE-NOTES-v0.1.0.md

# 4. Publish to npm (scoped package → --access public required the first time)
npm publish --access public
#  ↳ provenance deferred to v0.1.1 (needs GitHub Actions OIDC, not a laptop token)

# 5. Smoke-test the live package
cd /tmp && rm -rf publish-test && mkdir publish-test && cd publish-test
npx @nodewave/redesign install-mcp
npx @nodewave/redesign
#  ↳ editor opens at the printed URL → we're live
```

## §8 — Post-launch (v0.1.1 candidates)

- Wire GitHub Actions → OIDC → `npm publish --provenance` for supply-chain proof.
- **Starter component bundle** — ship the 9 components (charts, stat/quote cards, pills, etc.) as an opt-in `redesign seed --components` flow. Needs cross-platform smoke (macOS-only tested so far).
- Starter components bundle (`seed/components/` + `redesign seed --components`).
- Demo video slot on the landing page.
