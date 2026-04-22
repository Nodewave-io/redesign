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
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DB_PATH, ensureDirs } from './paths.js'

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
  const here = dirname(fileURLToPath(import.meta.url))
  // Schema files live alongside the package (not inside dist/), so we
  // walk up: dist/db/client.js → dist/.. → repo root → schema/
  const schemaPath = join(here, '..', '..', 'schema', '0001_init.sql')
  const sql = readFileSync(schemaPath, 'utf-8')
  db.exec(sql)
}
