# Showcase post — handoff prompt

This is the prompt to paste into a **fresh Claude Code session** to build the launch showcase post. It needs to run from `/Users/nodewave/Developer/nodewave/redesign/` so the `redesign` MCP loads (the `.mcp.json` is in that directory).

---

## How to set up

1. `cd ~/Developer/nodewave/redesign`
2. Make sure the editor is running:
   ```bash
   cd web && npm run dev -- -p 3100
   ```
   (or `node ../dist/cli.js start` after `npm run build:all` from the repo root)
3. Confirm `~/.redesign/config.json` has `port: 3100` (matches the editor).
4. Open a new Claude Code session in `~/Developer/nodewave/redesign/`.
5. Paste the block below.

---

## Prompt

```
You're going to build the launch showcase post for Redesign — a 5-7 slide LinkedIn carousel ABOUT Redesign itself. This is the first real post in the asset library; everything you compose well becomes a starter component for users.

The editor is already running at http://localhost:3100. The `redesign` MCP is loaded — you can verify with the tool list. The MCP talks to the same SQLite DB the editor reads.

Brand:
- Palette: cream #F5EFE6 / ink #18120F / orange accent #F04E23
- Fonts: Manrope (display), Space Mono (mono accent)
- Voice: confident, technical, no-bullshit. The product builds itself with Claude — say so plainly.
- Theme: pick dark (#0A0A0A bg, #F5F5F5 fg) — feels right for a developer tool launch on LinkedIn.

What it does (so you know what to communicate):
- Local-first MCP-driven editor for LinkedIn / Instagram carousels
- `npx @nodewave-io/redesign start` → editor at localhost + MCP for Claude Code
- Claude composes slides, you watch the canvas update live, you ship PNGs
- MIT, runs entirely offline, single SQLite file at ~/.redesign/

Slide structure (use this as a starting point — feel free to adjust):
1. **Hero** — big claim. One sentence. Logotype. Palette accent on a key word.
2. **Problem** — the existing carousel-design loop is ugly: Figma exports, hand placement, retries. (One image or diagram.)
3. **Solution** — Claude composes; you watch; you ship. Show the dev loop in three glyphs/icons.
4. **How** — install command + a 3-line "what happens" list. Make the install pill the focal element.
5. **Asset library** — components/icons compose. Show 6-8 little component tiles so the library concept is visible.
6. **Open** — MIT, GitHub link, NPM badge. (You can compose a "starred on GitHub" badge if it reads well.)
7. **CTA** — last slide is the install command + the URL.

Workflow:
- Start with `media_list_posts` to see if there's already a draft you should iterate on. If empty, `media_create_post` with title "Redesign — launch carousel", page_count 7, theme dark.
- For each slide, compose layers via `media_apply_batch` so a single concurrency token covers the whole slide. Don't add layers one-by-one.
- Use `media_screenshot` after each slide to verify it actually looks like what you described — text fits, colors track the brand, no overlaps. Iterate until you'd post it yourself.
- When you compose a tile/badge/diagram you'd want to reuse, save it with `media_save_layer_as_asset`. Write real `usage_notes` like "Use as a category badge on slide 1 of any product launch carousel — orange accent, ~80×32px, expects short label." Future Claude sessions read these notes.
- Goal: at the end you should have:
  - One polished 5-7 slide carousel
  - 5-10 reusable components saved to the asset library with real usage notes
  - The post's first-slide preview rendered correctly on the home grid (was bug-fixed today; verify)

Constraints:
- NO Lorem Ipsum. Every word is real launch copy.
- NO em-dashes in copy (commas/periods/parens instead — Tiago's house style).
- Don't feature Salesforce or any client name in copy.
- This is the FIRST post in the asset library; treat reusable component naming with care.

When done:
- Click Download in the editor to verify the PNG export works end-to-end.
- Tell Tiago: number of slides, number of components saved, anything that surprised you about the tool surface.

Go.
```

---

## What to verify after Claude finishes

- Open `http://localhost:3100` — the home grid should show the new post with a non-empty preview (text + layers visible). If it shows "Empty", the listPosts→preview pipeline regressed.
- Click into the post, scroll through all 7 slides — they should match what Claude described.
- Click **Download** — should produce a zip. First time will trigger Chrome install (~30-60s logged to stderr); subsequent are ~3s/slide.
- Visit `/assets` — the components Claude saved should be in the grid with their usage notes.
- Try editing one of the saved components from the asset library to confirm Edit modal works (Categories dropdown, save).

If any of these fails, that's the regression to fix before publishing tomorrow.
