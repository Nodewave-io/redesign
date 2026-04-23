// Inlined SQLite schema, mirroring schema/0001_init.sql at the package
// root. Embedded as a string so Next can bundle it without runtime
// file-path resolution (readFileSync against a .sql file next to the
// compiled route trips up the file-trace step in next build).
//
// When you change the schema: edit BOTH this file and the canonical
// schema/0001_init.sql at the package root. There's a CI check planned
// to diff the two and fail the build if they drift.

export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS media_assets (
  id           TEXT PRIMARY KEY,
  kind         TEXT NOT NULL DEFAULT 'image' CHECK (kind IN ('image','component')),
  name         TEXT NOT NULL,
  description  TEXT,
  usage_notes  TEXT,
  categories   TEXT NOT NULL DEFAULT '[]',
  tags         TEXT NOT NULL DEFAULT '[]',
  file_url     TEXT,
  storage_path TEXT,
  mime_type    TEXT,
  width        INTEGER,
  height       INTEGER,
  source_code  TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS media_assets_kind_idx       ON media_assets(kind);
CREATE INDEX IF NOT EXISTS media_assets_created_at_idx ON media_assets(created_at DESC);

CREATE TABLE IF NOT EXISTS media_posts (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT 'Untitled post',
  page_count    INTEGER NOT NULL DEFAULT 3 CHECK (page_count BETWEEN 1 AND 20),
  aspect_ratio  TEXT NOT NULL DEFAULT '4:5',
  theme         TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark','light')),
  slides        TEXT NOT NULL DEFAULT '{"slides":[],"layers":[]}',
  thumbnail_url TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS media_posts_updated_at_idx ON media_posts(updated_at DESC);

-- Auto-touch updated_at when any CONTENT field changes but the
-- caller forgot to advance the timestamp. Excludes thumbnail_url
-- because the export route writes that fire-and-forget after a
-- download — bumping updated_at there would invalidate the editor's
-- in-memory expected_updated_at and 409 the next user save.
DROP TRIGGER IF EXISTS media_posts_touch;
CREATE TRIGGER media_posts_touch
  AFTER UPDATE ON media_posts
  FOR EACH ROW
  WHEN OLD.updated_at IS NEW.updated_at
       AND (
         OLD.title IS NOT NEW.title OR
         OLD.page_count IS NOT NEW.page_count OR
         OLD.aspect_ratio IS NOT NEW.aspect_ratio OR
         OLD.theme IS NOT NEW.theme OR
         OLD.slides IS NOT NEW.slides
       )
BEGIN
  UPDATE media_posts
    SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
    WHERE id = NEW.id;
END;

CREATE TABLE IF NOT EXISTS media_post_revisions (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL REFERENCES media_posts(id) ON DELETE CASCADE,
  snapshot   TEXT NOT NULL,
  source     TEXT NOT NULL CHECK (source IN ('editor','mcp')),
  note       TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS media_post_revisions_post_created_idx
  ON media_post_revisions(post_id, created_at DESC);

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
`
