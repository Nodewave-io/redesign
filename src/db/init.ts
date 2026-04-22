#!/usr/bin/env node
// Standalone DB bootstrap — run with `npm run db:init`. Creates the
// ~/.redesign/ tree, opens the SQLite file, and runs schema/0001_init.sql.
// Idempotent: re-running just confirms every table + index + trigger.

import { closeDb, getDb } from './client.js'
import { DB_PATH, REDESIGN_HOME } from './paths.js'

const db = getDb()
const tables = db
  .prepare<[], { name: string }>(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
  )
  .all()
  .map((r) => r.name)

console.log(`[redesign] db ready at ${DB_PATH}`)
console.log(`[redesign] data dir: ${REDESIGN_HOME}`)
console.log(`[redesign] tables: ${tables.join(', ') || '(none)'}`)
closeDb()
