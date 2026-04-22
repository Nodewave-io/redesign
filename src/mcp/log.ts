// Audit-log wrapper. Every tool handler runs inside withLogging, which
// times the call, catches errors, and writes one row to media_mcp_log
// so you can query "what did Claude just do, and why did it take so
// long?" after the fact.
//
// We don't persist raw args — they can include source code or base64
// image bytes and would bloat the table. Instead, args get sha256'd
// to a short digest so identical calls correlate. The `post_id` column
// is extracted from args when present so you can filter per post.

import { createHash } from 'node:crypto'
import { insertMcpLog } from '../db/repo.js'

type ContentItem =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType: string }

type ToolResult = {
  content: ContentItem[]
  isError?: boolean
}

type Handler<A> = (args: A) => Promise<ToolResult>

export function withLogging<A extends Record<string, unknown>>(
  toolName: string,
  handler: Handler<A>,
): Handler<A> {
  return async (args: A): Promise<ToolResult> => {
    const start = Date.now()
    const digest = createHash('sha256')
      .update(JSON.stringify(args ?? {}))
      .digest('hex')
      .slice(0, 32)
    const a = (args ?? {}) as Record<string, unknown>
    const postId =
      typeof a.id === 'string'
        ? a.id
        : typeof a.postId === 'string'
          ? a.postId
          : null

    try {
      const result = await handler(args)
      const isError = result.isError === true
      safeLog({
        tool_name: toolName,
        args_digest: digest,
        post_id: postId,
        status: isError ? 'error' : 'ok',
        duration_ms: Date.now() - start,
        error_message: isError ? summarize(result) : null,
      })
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      safeLog({
        tool_name: toolName,
        args_digest: digest,
        post_id: postId,
        status: 'error',
        duration_ms: Date.now() - start,
        error_message: message.slice(0, 2000),
      })
      return {
        content: [{ type: 'text', text: message }],
        isError: true,
      }
    }
  }
}

// Never let logging failure break a tool call — the MCP is more useful
// without audit than not usable at all.
function safeLog(row: Parameters<typeof insertMcpLog>[0]): void {
  try {
    insertMcpLog(row)
  } catch (err) {
    console.error('[redesign-mcp] log insert failed', err)
  }
}

function summarize(result: ToolResult): string {
  const text = result.content
    .map((c) => (c.type === 'text' ? c.text : `<${c.type}>`))
    .join(' ')
    .slice(0, 500)
  return text || 'tool returned isError with empty content'
}
