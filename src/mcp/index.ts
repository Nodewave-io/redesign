#!/usr/bin/env node
// Entry point for the Redesign MCP — a local stdio server that Claude
// Code launches on demand (via the snippet printed by `redesign
// mcp-config`). Reads/writes the SQLite DB at ~/.redesign/db.sqlite.
//
// CRITICAL: stdout is the JSON-RPC channel — any console.log would
// corrupt protocol messages. Diagnostic output MUST go to stderr.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { getDb } from '../db/client.js'
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

async function main(): Promise<void> {
  // Touch the DB once on boot so schema is applied before any tool
  // call runs. Subsequent `getDb()` calls reuse the singleton.
  getDb()

  const server = new McpServer(
    { name: 'redesign', version: '0.1.0' },
    {
      instructions:
        "Drives the local Redesign editor at http://localhost:3000. Always call media_get_post before editing so you have the current updated_at for the optimistic-concurrency guard. Layers are free-floating with x/y/w/h/spans — compose slides like web pages. Prefer media_apply_batch over many single writes, and prefer the introspection tools (media_check_alignment / media_check_overlaps / media_validate_layout / media_describe_post) over screenshots whenever the question is geometric.",
    },
  )

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
}

main().catch((err) => {
  console.error('[redesign-mcp] fatal', err)
  process.exit(1)
})
