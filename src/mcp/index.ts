#!/usr/bin/env node
// Entry point for the Redesign MCP — a local stdio server that Claude
// Code launches on demand (via the snippet printed by `redesign
// mcp-config`). Reads/writes the SQLite DB at ~/.redesign/db.sqlite.
//
// CRITICAL: stdout is the JSON-RPC channel — any console.log would
// corrupt protocol messages. Diagnostic output MUST go to stderr.

import { realpathSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { getDb } from '../db/client.js'
import { registerCollectionReadTools } from './tools/collections-read.js'
import { registerCollectionWriteTools } from './tools/collections-write.js'
import { registerFontTools } from './tools/fonts-read.js'
import { registerPostReadTools } from './tools/posts-read.js'
import { registerPostWriteTools } from './tools/posts-write.js'
import { registerLayerWriteTools } from './tools/layers-write.js'
import { registerBatchTools } from './tools/batch-write.js'
import { registerAssetReadTools } from './tools/assets-read.js'
import { registerAssetCurateTools } from './tools/asset-curate.js'
import { registerUploadTools } from './tools/uploads.js'
import { registerRevisionTools } from './tools/revisions.js'
import { registerInspectTools } from './tools/inspect.js'
import { registerValidateTool } from './tools/validate.js'
import { registerScreenshotTool } from './tools/screenshot.js'

export async function run(): Promise<void> {
  // Touch the DB once on boot so schema is applied before any tool
  // call runs. Subsequent `getDb()` calls reuse the singleton.
  getDb()

  const server = new McpServer(
    { name: 'redesign', version: '0.3.2' },
    {
      instructions:
        "Drives the local Redesign editor at http://localhost:3000. Posts are grouped into collections (e.g. one per company/client). Every post belongs to exactly one collection. Before creating a post, call media_list_collections and either infer the right collection_id from context or ask the user. Always call media_get_post before editing so you have the current updated_at for the optimistic-concurrency guard. Layers are free-floating with x/y/w/h/spans; compose slides like web pages. Prefer media_apply_batch over many single writes, and prefer the introspection tools (media_check_alignment / media_check_overlaps / media_validate_layout / media_describe_post) over screenshots whenever the question is geometric. For text layers, call media_list_fonts to see available font families (built-ins plus any custom font under ~/.redesign/fonts/) and pass the family verbatim in fontFamily.",
    },
  )

  registerCollectionReadTools(server)
  registerCollectionWriteTools(server)
  registerFontTools(server)
  registerPostReadTools(server)
  registerPostWriteTools(server)
  registerLayerWriteTools(server)
  registerBatchTools(server)
  registerAssetReadTools(server)
  registerAssetCurateTools(server)
  registerUploadTools(server)
  registerRevisionTools(server)
  registerInspectTools(server)
  registerValidateTool(server)
  registerScreenshotTool(server)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('[redesign-mcp] stdio ready')

  // Keep the process alive until stdin closes (Claude Code disconnects
  // by closing the pipe). Without this, callers who `await run()` would
  // resolve immediately after the handshake is set up and could then
  // call process.exit, killing the server mid-session.
  await new Promise<void>((resolve) => {
    const stdin = process.stdin
    const done = () => resolve()
    stdin.once('end', done)
    stdin.once('close', done)
  })
}

// Auto-run only when this file is the process entry (e.g. the `bin`
// symlink was invoked directly). Don't auto-run on dynamic import from
// the CLI — the CLI awaits `run()` itself.
function isEntry(): boolean {
  const argv1 = process.argv[1]
  if (!argv1) return false
  try {
    return pathToFileURL(realpathSync(argv1)).href === import.meta.url
  } catch {
    try {
      return pathToFileURL(argv1).href === import.meta.url
    } catch {
      return false
    }
  }
}

if (isEntry()) {
  run().catch((err) => {
    console.error('[redesign-mcp] fatal', err)
    process.exit(1)
  })
}
