# Redesign

Claude builds your LinkedIn and Instagram carousels, locally and free.
MIT-licensed, open source, zero cloud. A [Nodewave](https://nodewave.io)
project.

> **Status: pre-alpha.** The package scaffold + SQLite backend are in
> place; the Next.js editor and MCP tool port are in progress. See
> [`HANDOFF.md`](./HANDOFF.md) for the migration state.

## Install (once shipped)

```bash
npx @nodewave/redesign start
```

That starts a local server on `localhost:3000`, bootstraps a SQLite DB
at `~/.redesign/db.sqlite`, and prints a `.mcp.json` snippet you paste
into your Claude Code config.

## What it is

Redesign is an AI-driven content tool that lets Claude (via the Model
Context Protocol) read, author, and edit multi-slide posts inside a
local editor you control. You tell Claude what you want your next
LinkedIn or Instagram carousel to say. Claude designs it in your
editor in real time. You watch.

- **Local-first.** Your posts, your assets, your database. Nothing
  leaves your machine — not even our servers, because we don't have any.
- **Claude-native.** 40-tool MCP. Claude reads your post as data,
  makes changes as intent, validates before saving.
- **Honest open source.** MIT. Fork it, audit it, host it yourself.

## Architecture

```
~/.redesign/
  db.sqlite       single-file DB (better-sqlite3, WAL mode)
  assets/         uploaded image + component thumbnails
  exports/        generated carousel zips
  logs/mcp.log    MCP stderr mirror
```

- `src/db/` — SQLite repository + fs storage (the only module that
  touches SQL or the disk).
- `src/mcp/` — stdio MCP server, 40-tool surface. Imports `src/db/`.
- `web/` — Next.js editor (to be copied over from
  `nw-site/app/admin/media/`). Calls `src/db/` through Next API routes.
- `schema/0001_init.sql` — SQLite schema, run on first boot.

## Credits

Built by [Tiago Lemos](https://nodewave.io) at Nodewave. Originally an
internal tool for our agency content; open-sourced because we figured
everyone should have it.

## License

MIT. See [LICENSE](./LICENSE).
