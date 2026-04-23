# @nodewave/redesign v0.1.0

First public release. Local-first carousel builder for LinkedIn / Instagram: talk to Claude Code, get a polished post.

## What's in the box

- **CLI** — `npx @nodewave/redesign` boots the editor; `install-mcp` wires up Claude Code in one command.
- **MCP server** — 40 tools for reading, writing, laying out, screenshotting, and exporting posts.
- **Editor** (Next.js, App Router) — free-floating layers with x/y/w/h/spans, live Claude sync, auto-save.
- **Storage** — SQLite at `~/.redesign/db.sqlite`, assets under `~/.redesign/assets/`. Nothing leaves your machine.
- **Export** — parallel-pages PNG export with concurrency 4, driven by a lazy-downloaded Chromium.

## Security posture

- SSRF-guarded URL fetching (blocks `file://`, RFC1918, link-local, including `169.254.169.254`).
- Storage path traversal guard in the storage bucket resolver.
- CSS `url("…")` sanitizer on image layers.
- `install-mcp` writes atomically via tmpfile + rename with mode 0600.
- Editor binds to `127.0.0.1` only (standalone + dev fallback).

See [`SECURITY.md`](../SECURITY.md) for the full threat model.

## Requirements

- Node 20+
- Claude Code (for the MCP layer)
- ~200 MB for auto-downloaded Chromium on first export

## Install

```bash
npx @nodewave/redesign install-mcp   # one-time — wires up ~/.claude/mcp.json
npx @nodewave/redesign                # boots the editor
```

Source: [github.com/Nodewave-io/redesign](https://github.com/Nodewave-io/redesign) · License: MIT
