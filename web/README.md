# redesign/web

The editor bundled with `@nodewave-io/redesign`. Next.js 15 + React 19.

**Current state (2026-04-22):** every editor file is a byte-identical
copy of its counterpart in `nw-site/app/admin/media/**`. Nothing has
been edited yet — the next pass will:

1. Replace `@/lib/supabase` imports with a local API client that hits
   `/api/posts/*`, `/api/assets/*` routes backed by `@nodewave-io/redesign`'s
   SQLite repo.
2. Rip the `supabase.auth.getUser()` / `/admin` redirect logic — this
   is single-user local, no auth needed.
3. Swap `@/app/admin/media/_lib/types` imports in API routes for the
   DB types shared with the MCP package.
4. Replace the `/api/media/export` puppeteer path with the same
   chromium resolver the MCP uses.
5. Apply the final landing palette to `app/admin/_styles.css` + the
   design tokens.

Until then: `npm run typecheck` passes. `npm run dev` will boot the
server, but any page that calls Supabase will error at runtime — by
design, waiting on step 1.

## Byte-identity verification

```bash
diff -rq ../../nw-site/app/admin/media ./app/admin/media
diff -q  ../../nw-site/components/admin/sidebar.tsx ./components/admin/sidebar.tsx
diff -q  ../../nw-site/lib/supabase.ts ./lib/supabase.ts
diff -q  ../../nw-site/app/admin/_styles.css ./app/admin/_styles.css
diff -rq ../../nw-site/app/api/media ./app/api/media
```

Nothing printed → every file matches.
