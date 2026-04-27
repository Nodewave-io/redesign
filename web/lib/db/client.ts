// Singleton better-sqlite3 client.
//
// better-sqlite3 is synchronous by design — every query is a blocking
// call on the JS thread. That's fine here: a local single-user editor
// makes one DB call at a time, and the zero-async model is simpler
// than the async-everything Supabase shape. Prepared statements are
// cached per-SQL so the hot paths (list, get, update) don't re-parse.
//
// WAL mode is set in schema/0001_init.sql — let it alone here.

import Database from 'better-sqlite3'
import { randomUUID } from 'node:crypto'
import { DB_PATH, ensureDirs } from './paths'
import { SCHEMA_SQL } from './schema'

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  ensureDirs()
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  bootstrap(db)
  _db = db
  return db
}

export function closeDb(): void {
  if (_db) {
    _db.close()
    _db = null
  }
}

// Run the init SQL every boot. `CREATE TABLE IF NOT EXISTS` + matching
// CREATE TRIGGER IF NOT EXISTS statements make this idempotent, so we
// don't need a formal migration runner until we add schema v2.
function bootstrap(db: Database.Database): void {
  db.exec(SCHEMA_SQL)
  migrateCollectionId(db)
  ensureDefaultCollection(db)
}

// Pre-collections databases (≤0.2.2) don't have a `collection_id`
// column on media_posts. Mirrors the logic in src/db/client.ts.
function migrateCollectionId(db: Database.Database): void {
  const cols = db
    .prepare<[], { name: string }>(`PRAGMA table_info(media_posts)`)
    .all()
  if (!cols.some((c) => c.name === 'collection_id')) {
    db.exec(
      `ALTER TABLE media_posts ADD COLUMN collection_id TEXT REFERENCES media_collections(id)`,
    )
  }
  // Always ensure the index exists (idempotent). Done here rather than
  // in the schema SQL because that file runs before the ALTER, so on
  // upgrades the index would reference a column that didn't yet exist.
  db.exec(
    `CREATE INDEX IF NOT EXISTS media_posts_collection_id_idx ON media_posts(collection_id)`,
  )
}

function ensureDefaultCollection(db: Database.Database): void {
  const existing = db
    .prepare<[], { id: string }>(
      `SELECT id FROM media_collections ORDER BY created_at ASC LIMIT 1`,
    )
    .get()
  let defaultId = existing?.id
  if (!defaultId) {
    defaultId = randomUUID()
    db.prepare(
      `INSERT INTO media_collections (id, name) VALUES (?, 'Default')`,
    ).run(defaultId)
  }
  db.prepare(
    `UPDATE media_posts SET collection_id = ? WHERE collection_id IS NULL`,
  ).run(defaultId)
}
