// media_screenshot + media_screenshot_strip — renders a slide (or all
// slides) to PNG/JPEG via headless Chrome pointed at the local editor.
//
// This file is a STUB for now. The real implementation needs:
//   1. The editor ported into redesign/web/ (Next app) so we can point
//      puppeteer at http://127.0.0.1:<port>/render/<postId>/<slideIndex>.
//   2. A Chromium resolver (either a bundled browser via puppeteer's
//      install script, or a "bring your own Chrome" path so the tarball
//      stays small).
//
// Until then the tools are registered so Claude sees a clear "not yet
// available" error instead of a mysterious missing-tool failure.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'

export function registerScreenshotTool(server: McpServer): void {
  server.registerTool(
    'media_screenshot',
    {
      description:
        '(pre-release) Render a slide to PNG/JPEG. Returns an image content block inline. Currently unavailable — lands once redesign/web/ ships the editor.',
      inputSchema: {
        id: z.string().uuid(),
        slideIndex: z.number().int().min(0),
        format: z.enum(['png', 'jpeg']).optional(),
        quality: z.number().int().min(1).max(100).optional(),
        scale: z.number().min(0.5).max(3).optional(),
      },
    },
    withLogging('media_screenshot', async () => {
      throw new Error(
        'media_screenshot is not yet available in the standalone package. Use media_describe_post + media_check_alignment / media_check_overlaps / media_validate_layout for geometric answers without a screenshot, or run the editor in nw-site for now.',
      )
    }),
  )

  server.registerTool(
    'media_screenshot_strip',
    {
      description:
        '(pre-release) Render all slides side-by-side as one composite image. Currently unavailable — lands once redesign/web/ ships the editor.',
      inputSchema: {
        id: z.string().uuid(),
        format: z.enum(['png', 'jpeg']).optional(),
        quality: z.number().int().min(1).max(100).optional(),
        scale: z.number().min(0.5).max(3).optional(),
      },
    },
    withLogging('media_screenshot_strip', async () => {
      throw new Error(
        'media_screenshot_strip is not yet available in the standalone package. See media_screenshot for alternatives.',
      )
    }),
  )
}
