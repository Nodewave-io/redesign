-- Redesign — SQLite schema (mirror of nw-site Supabase media tables).
--
-- Single-user local DB at ~/.redesign/db.sqlite. No auth, no RLS —
-- the file system owns access. Run once at first boot; idempotent.
--
-- Type mappings from Postgres → SQLite:
--   uuid          → TEXT  (generated in app via crypto.randomUUID())
--   timestamptz   → TEXT  (ISO-8601 UTC strings, generated in app)
--   jsonb         → TEXT  (JSON strings, validated by zod in the app)
--   text[]        → TEXT  (JSON arrays stored as strings, e.g. '["a","b"]')
--   bigserial     → INTEGER PRIMARY KEY AUTOINCREMENT
--
-- Keep this file sync'd with nw-site/supabase/migrations/*media*. If
-- you add a column in Postgres, add it here too.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─── media_assets ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id           TEXT PRIMARY KEY,
  kind         TEXT NOT NULL DEFAULT 'image' CHECK (kind IN ('image','component')),
  name         TEXT NOT NULL,
  description  TEXT,
  usage_notes  TEXT,
  categories   TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
  tags         TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
  file_url     TEXT,                        -- null for component assets
  storage_path TEXT,                        -- relative path under ~/.redesign/assets
  mime_type    TEXT,
  width        INTEGER,
  height       INTEGER,
  source_code  TEXT,                        -- only for kind='component'
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS media_assets_kind_idx       ON media_assets(kind);
CREATE INDEX IF NOT EXISTS media_assets_created_at_idx ON media_assets(created_at DESC);

-- ─── media_posts ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_posts (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT 'Untitled post',
  page_count    INTEGER NOT NULL DEFAULT 3 CHECK (page_count BETWEEN 1 AND 20),
  aspect_ratio  TEXT NOT NULL DEFAULT '4:5',
  theme         TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark','light')),
  slides        TEXT NOT NULL DEFAULT '{"slides":[],"layers":[]}',  -- JSON
  thumbnail_url TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS media_posts_updated_at_idx ON media_posts(updated_at DESC);

-- Auto-touch updated_at on any UPDATE.
CREATE TRIGGER IF NOT EXISTS media_posts_touch
  AFTER UPDATE ON media_posts
  FOR EACH ROW
  WHEN OLD.updated_at IS NEW.updated_at
BEGIN
  UPDATE media_posts
    SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
    WHERE id = NEW.id;
END;

-- ─── media_post_revisions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_post_revisions (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES media_posts(id) ON DELETE CASCADE,
  snapshot   TEXT NOT NULL,              -- full JSON snapshot
  source     TEXT NOT NULL CHECK (source IN ('editor','mcp')),
  note       TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS media_post_revisions_post_created_idx
  ON media_post_revisions(post_id, created_at DESC);

-- Trim each post's history to the most recent 30 after every insert.
CREATE TRIGGER IF NOT EXISTS media_post_revisions_trim
  AFTER INSERT ON media_post_revisions
  FOR EACH ROW
BEGIN
  DELETE FROM media_post_revisions
    WHERE post_id = NEW.post_id
      AND id NOT IN (
        SELECT id FROM media_post_revisions
         WHERE post_id = NEW.post_id
         ORDER BY created_at DESC
         LIMIT 30
      );
END;

-- ─── media_mcp_log ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_mcp_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_name     TEXT NOT NULL,
  args_digest   TEXT NOT NULL,
  post_id       TEXT,
  status        TEXT NOT NULL CHECK (status IN ('ok','error')),
  duration_ms   INTEGER NOT NULL,
  error_message TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS media_mcp_log_created_idx ON media_mcp_log(created_at DESC);
CREATE INDEX IF NOT EXISTS media_mcp_log_post_idx    ON media_mcp_log(post_id);
