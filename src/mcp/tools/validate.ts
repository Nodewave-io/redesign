// media_validate_code — transpile-only TSX check. Answers "will this
// code-layer source at least parse + compile, or will the browser
// runtime blow up?" without actually rendering anything.
//
// Uses the same @babel/standalone the in-browser runtime uses, with
// the same sourceType/script + classic-JSX preset so results match.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'

export function registerValidateTool(server: McpServer): void {
  server.registerTool(
    'media_validate_code',
    {
      description:
        "Transpile-check a TSX snippet without rendering. Use before committing a new code-layer source to catch syntax errors cheap. Returns {ok: true} or {ok: false, error: '<message>'}.",
      inputSchema: {
        source: z.string().min(1).max(100_000),
      },
    },
    withLogging('media_validate_code', async ({ source }: { source: string }) => {
      const result = await tryTranspile(source)
      return textJson(result)
    }),
  )
}

async function tryTranspile(
  source: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    // @babel/standalone has no published types; we only touch `transform`.
    // Keep it as an optional dep so users who don't author code layers
    // don't pay the ~2 MB install cost — lazy-import inside try so a
    // missing module surfaces as a friendly error.
    const babel = (await import('@babel/standalone')) as unknown as {
      transform: (
        code: string,
        options: Record<string, unknown>,
      ) => { code?: string | null }
    }
    const stripped = source
      .replace(/^\s*"use client";?\s*/m, '')
      .replace(/^\s*'use client';?\s*/m, '')
      .replace(/^\s*import[^;]+;?\s*/gm, '')
      .trim()
    const isExpression = stripped.startsWith('<')
    const toTransform = isExpression ? `(${stripped})` : stripped
    babel.transform(toTransform, {
      sourceType: 'script',
      filename: 'snippet.tsx',
      presets: [
        ['typescript', { isTSX: true, allExtensions: true }],
        ['react', { runtime: 'classic' }],
      ],
    })
    return { ok: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: msg }
  }
}
