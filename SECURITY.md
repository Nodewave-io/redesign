# Security policy

## Threat model

Redesign is a local-first tool. The Next editor binds to `127.0.0.1`,
the MCP server runs over stdio under your Claude Code process, and
`~/.redesign/` is owned by your user. We do not assume the network
will reach the editor; we DO assume that any URL or asset Claude is
asked to import could be hostile.

## What we defend against

- **Path traversal**: every storage path is validated against an
  allowlist of buckets (`assets`, `exports`) and rejects `..` or
  absolute paths before touching disk
  ([`web/lib/db/storage.ts`](web/lib/db/storage.ts)).
- **SSRF**: `media_upload_image_from_url` and `media_screenshot_url`
  reject `file://`, `data:`, RFC1918, loopback, link-local, CGNAT
  and multicast targets, plus the cloud-metadata IP
  (`169.254.169.254`). See `assertPublicHttpUrl` in
  [`src/mcp/tools/uploads.ts`](src/mcp/tools/uploads.ts).
- **CSS injection**: image-layer URLs are sanitized before they
  enter `background-image: url("…")` so a crafted URL can't break
  out of the CSS string
  ([`web/app/_lib/render.tsx`](web/app/_lib/render.tsx)).
- **DB injection**: every SQL statement is a parameterized
  prepared statement (`better-sqlite3` with `@named` / `?`
  placeholders, no string interpolation).
- **Editor binding**: the standalone server explicitly sets
  `HOSTNAME=127.0.0.1`. The dev fallback (`next start`) passes
  `-H 127.0.0.1`.

## What we DO NOT defend against (yet)

### Component asset code execution

`media_create_component_asset` accepts arbitrary TSX as the asset
body. The asset library renders that code inside the editor origin
(`localhost:<port>`) via Babel + `new Function`. A malicious
component, once stored, could call the editor's local API
(`/api/posts`, `/api/storage/upload`, etc.) on next render.

**This means: only paste component source you trust.** Treat the
component library the same way you'd treat `~/.zshrc`. It's code
that runs with your user's privileges.

A future release will isolate the runtime in a sandboxed `<iframe>`
served from a `null`-origin so a hostile component can no longer
reach the editor's API. Tracked as a v0.2 blocker.

### Untrusted local processes

`~/.redesign/` is read/write to your user. Anything else running as
your user can read your post drafts, the SQLite DB, and Chrome's
data dir. Standard local-machine assumption.

## Reporting a vulnerability

Email `tiagolemos@nodewave.io` with details + a PoC if you have one.
We acknowledge within 48 hours and aim to patch within 14 days.
Public disclosure after a fix ships, with credit to you unless you
prefer otherwise.
