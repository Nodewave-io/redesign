# Redesign

Claude builds your LinkedIn and Instagram carousels, locally and free.
MIT-licensed, open source, zero cloud. A [Nodewave](https://nodewave.io)
project.

```bash
npx @nodewave-io/redesign
```

That's the whole install. Open `http://localhost:3000`, paste the MCP
snippet it prints into Claude Code, and start designing.

## What it is

You tell Claude what your next post should say. Claude composes the
slides in a local editor you watch live. Text, images, generated
components, layout. You correct, refine, ship.

- **Local-first.** Posts, assets, and the SQLite DB live in
  `~/.redesign/`. Nothing leaves your machine.
- **Claude-native.** 40-tool MCP server. Claude reads your post as
  data, edits with intent, validates before save.
- **Open source.** MIT. Fork it, audit it, run it yourself.

## Quickstart

### 1. Boot the editor

```bash
npx @nodewave-io/redesign
```

What this does, step by step:

1. Picks a free port (3000 → 3100 → 3200) and binds to `127.0.0.1`.
2. Creates `~/.redesign/` if it doesn't exist; bootstraps `db.sqlite`.
3. Prints the editor URL and a `.mcp.json` snippet for Claude Code.
4. Starts the Next.js editor and waits for Ctrl-C.

You don't need a Nodewave account. The package never makes a network
call to us, only to npm (when you install) and to Google's CDN
(first time you export, to download Chrome ~200 MB into
`~/.redesign/chromium/`).

### 2. Connect Claude Code

Paste the snippet `start` printed into either:

- **Project-scoped:** `.mcp.json` in your repo root (Claude Code picks
  it up on session start).
- **Globally:** `~/.claude/mcp.json`.

Or just run:

```bash
npx @nodewave-io/redesign mcp-config
```

Then restart Claude Code. You'll see `redesign` in the MCP server
list.

### 3. Build your first post

Open the editor URL. The home is a list of **collections**, a way to
group posts by company, client, or topic so a single install can hold
posts for multiple workstreams without mixing them. On first run a
"Default" collection exists; rename it or click **New collection** to
add more.

Open a collection, click **New post**, then in Claude Code:

> Open my latest post and build a 5-slide carousel about my new
> product. Dark theme. Punchy hook on slide 1, value props on 2-4,
> install command on 5.

Claude calls `media_get_post`, composes the layers, screenshots to
verify, and tells you when it's done. You watch the editor update in
real time. Reload to refresh, or click **Download** to export a zip
of PNGs ready to upload to LinkedIn / Instagram.

When you ask Claude to start a fresh post, it will check
`media_list_collections` first and either pick the right one from
context ("the Nodewave collection") or ask you which collection it
belongs in.

### 4. Bring your own fonts (optional)

Built-ins (Geist, Manrope, Space Mono, Inter, system) cover most
posts, but if you have a brand typeface drop it in. Two ways:

1. **From the editor:** open **Assets**, click **Upload**, pick
   **Font**, drop in a `.ttf`, `.otf`, `.woff`, or `.woff2` file (up
   to 5 MB). The file's name without the extension becomes the font
   family. Once uploaded, the font shows up as a card on the Assets
   page with a live "AaBbCc" specimen, and the editor's right-panel
   font picker gains a "Your fonts" group.
2. **By hand:** drop the file straight into `~/.redesign/fonts/`. The
   editor scans this folder on every page load, so a refresh is
   enough.

Claude discovers your fonts via the `media_list_fonts` MCP tool and
can reference them by family name in any text layer:

> Use the InstrumentSerifItalic font for the section headings on
> slides 2 and 4.

Headless export (the **Download** button) loads the same fonts before
the screenshot, so PNGs ship with your typography intact.

## Commands

```bash
redesign                       # Start the editor (shorthand for `redesign start`)
redesign start [--port 3000]   # Start the editor on a specific port
redesign mcp                   # Run stdio MCP server (Claude Code calls this)
redesign mcp-config            # Print .mcp.json snippet
redesign init                  # Just bootstrap ~/.redesign/, no editor
redesign seed [dir]            # Import a folder of TSX components/icons
redesign doctor                # Environment check
redesign update                # Upgrade to the latest version on npm
redesign reset [--yes]         # Wipe ~/.redesign/ (asks first)
redesign version
```

## Updating

```bash
npm install -g @nodewave-io/redesign
```

That's it. No `@<version>` needed, npm pulls whatever's tagged `latest`
on the registry. To check whether a new version is available without
upgrading, run `npm outdated -g`. Or, from inside Redesign itself:

```bash
redesign update
```

## Requirements

- **Node 20+**
- **Claude Code** ([install](https://docs.anthropic.com/en/docs/claude-code))
- **~250 MB free disk** for Chrome (downloaded on first export)
- macOS, Linux, or Windows

Tested on macOS. Linux and Windows feedback welcome, [open an issue](https://github.com/Nodewave-io/redesign/issues) with the output of `npx @nodewave-io/redesign connect` if something breaks.

## Data + privacy

Everything lives under `~/.redesign/`:

```
~/.redesign/
  db.sqlite          single-file DB (WAL mode)
  assets/            uploaded images + component sources
  exports/           generated carousel zips
  fonts/             user-supplied .ttf/.otf/.woff/.woff2 files
  chromium/          puppeteer's Chrome (auto-downloaded)
  config.json        editor port + pid (overwritten each `start`)
```

The Next server binds to `127.0.0.1` only. Nothing in this package
phones home. The MCP log table (`media_mcp_log`) records tool calls
locally for debugging. Never transmitted anywhere.

To wipe everything: `redesign reset`.

## Troubleshooting

**`port 3000 was in use, bound to 3100`**: fine, the CLI walked the
port grid (3000 → 3100 → 3200). Use the URL it printed.

**First export is slow (~30-60s)**: that's Chrome installing. Watch
for `[redesign] installing Chrome (...) to ~/.redesign/chromium/`.
Subsequent exports are ~3s/slide.

**MCP tools missing in Claude Code**: first, restart Claude Code after
running `redesign start`. If the tools still don't appear:

1. Run the verified installer:
   ```
   npx @nodewave-io/redesign connect
   ```
   It registers the MCP, boots the stdio server locally to prove it
   responds, and reports any concrete error. Green here means Claude
   Code should see the tools after a restart.
2. If `connect` is green but tools still don't show, run
   `claude mcp list`. You should see `redesign: connected`. If it says
   `connecting` for more than ~10 seconds, the config is reaching
   Claude Code but the handshake isn't completing on its side.
3. Easiest fallback: ask Claude directly in any session,
   *"try connecting to the redesign MCP and report what you see"*.
   Claude can read `/mcp` and `claude mcp list` output and diagnose
   the specific failure mode.
4. `redesign doctor` confirms the local schema + data dir are fine
   (independent of the MCP link).

**`This post was modified somewhere else`**: the editor and Claude
both edited the same post simultaneously. Reload the editor; latest
wins. (Optimistic concurrency on `updated_at`.)

## Architecture

```
~/.redesign/db.sqlite : single source of truth at runtime

src/cli.ts            : one-shot CLI, spawns the editor + MCP
src/mcp/              : stdio MCP server, 11 tool files
src/db/               : SQLite repo + fs storage (server-side)
src/browser.ts        : lazy Chrome installer for export

web/                  : Next.js editor
  app/                : pages (posts list, edit, assets, render)
  app/api/            : REST shim that maps editor calls to src/db/
  lib/db/             : vendored copy of src/db/ for the Next server
  lib/supabase.ts     : translator: Supabase chain calls → fetch

schema/0001_init.sql  : DB bootstrap (idempotent)
```

The `lib/db/` files are kept in lock-step with `src/db/`. If you
patch one, patch the other.

## Contributing

Issues + PRs welcome at
[github.com/Nodewave-io/redesign](https://github.com/Nodewave-io/redesign).
The codebase is small (~10k LoC) and read-it-in-an-afternoon. Start
with `LAUNCH-CHECKLIST.md` for a current map of what's shipped and
what's pending.

## Credits

Built by [Tiago Lemos](https://nodewave.io) at Nodewave. Born from
the internal tool we used for our own client work; open-sourced so
everyone can have a Claude-native content workflow.

## License

MIT. See [LICENSE](./LICENSE).
