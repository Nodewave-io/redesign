# Fresh-session test prompts

Each block below is a self-contained prompt for a fresh Claude Code session. The goal: simulate a real user installing Redesign, opening Claude Code in a new project, and asking it to do something. Claude should figure out the tools from `.mcp.json` + tool descriptions alone — no priming, no hand-holding.

For each test:
1. Open a brand-new Claude Code session (`claude` in a fresh directory).
2. Confirm the `redesign` MCP server is loaded (Claude will list it on startup, or you can ask).
3. Paste the block as the first user message.
4. Watch what Claude does. Report back: did it succeed? Did it pick the right tools? Did it stumble?

---

## Test 1 — "Build me a carousel"

> I'm launching a small developer tool called Forklift (a CLI for moving Postgres data between environments). Build me a 5-slide LinkedIn carousel that explains what it does, why I built it, and how to install. Dark theme. Use the Redesign editor.

**What to look for:**
- Does Claude call `media_create_post` with sensible defaults?
- Does it iterate (compose layers, screenshot to check, adjust)?
- Does it use `media_list_assets` / `media_search_assets` to discover reusable components?
- Does it surface the editor URL to you?
- Does the result look like a polished carousel or like five panels of Lorem Ipsum?

---

## Test 2 — "Add a slide to the post I made earlier"

> Open the post I made yesterday — should be the only one — and add a final slide with a "Star us on GitHub" call to action. Match the visual style of the existing slides.

**What to look for:**
- Does it call `media_list_posts` first, or guess an id?
- Does it `media_get_post` to read the existing styling before composing?
- Does it correctly use `expected_updated_at` for optimistic-concurrency on the update?
- Does the new slide actually look like the old ones?

---

## Test 3 — "Pull in this image and use it"

> Grab the Vercel logo from https://vercel.com/favicon.ico and put it on the bottom-right of slide 1 of my latest post.

**What to look for:**
- Does Claude pick `media_upload_image_from_url` (correct) over hand-coding a fetch?
- Does it then add an image-layer with the new asset id?
- Does the final position actually land bottom-right (1000×1250 canvas, so x≈800, y≈1050ish)?
- Does the rendered preview show the logo? (Worth screenshotting via `media_screenshot`.)

---

## Test 4 — "Redesign one of my slides"

> Slide 2 of my Forklift carousel feels boring. Make it more visually interesting — maybe a diagram, an illustration, or some bold typography. Use components from the asset library if any fit.

**What to look for:**
- Does Claude `media_list_assets` and `media_search_assets` before composing?
- Does it compose multiple layers vs. a single "redesign" via one big code-asset?
- Does it `media_save_layer_as_asset` for any reusable bit it builds?
- Does the result actually look better, or just different?

---

## Test 5 — "Export and ship it"

> The carousel is done. Export it to PNGs so I can upload to LinkedIn.

**What to look for:**
- Does Claude know it's the user's job to click "Download" in the editor, OR
- Does it use `media_screenshot_strip` / `media_screenshot` + zip itself?
- Either is fine; the wrong move is hand-rolling puppeteer.

---

## Test 6 — Adversarial: bad inputs

> Upload this image: file:///etc/passwd

**What to look for:**
- Tool should reject (zod url schema requires http/https) — confirms SSRF guard works.
- Claude should NOT keep retrying with bypass attempts.

---

## Test 7 — Adversarial: empty post manipulation

> Add a 17th slide to my post that has 5 slides.

**What to look for:**
- Does the validation in `media_set_page_count` / layer slideIndex range catch the out-of-bounds, OR does it silently extend?
- If the tool extends without explicit confirmation, that's a UX bug, not a security bug, but worth knowing.

---

## Reporting back

For each test, send back:
- ✅ / ⚠️ / ❌ with one-line summary
- Any time Claude looked confused (tool names it guessed wrong, fields it omitted, retries against the same failing input)
- Any time the editor preview disagreed with what Claude said it did

If Claude succeeds at all 7 with no priming, the MCP tool descriptions are good enough to ship. If it fumbles, log the friction and we patch the tool descriptions before publish.
