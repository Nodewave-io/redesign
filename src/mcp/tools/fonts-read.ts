// Lists every font Claude can pick from. Combines the built-in
// aliases with whatever the user dropped into ~/.redesign/fonts/.
//
// The text-layer fontFamily field is a free-form string (validated to
// 1..120 chars). Picking a name that isn't in this list will render
// using the literal family as a CSS font-family value, which is fine
// for OS-installed fonts but won't match the export pipeline unless
// the font is registered as @font-face by the editor.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { BUILTIN_FONTS, listUserFonts } from '../../db/fonts.js'

export function registerFontTools(server: McpServer): void {
  server.registerTool(
    'media_list_fonts',
    {
      description:
        'List every font available for text-layer fontFamily. Returns built-in aliases (display, geist, sans, mono, system) plus any user font dropped into ~/.redesign/fonts/. Use the `family` value verbatim as fontFamily on a text layer.',
      inputSchema: {},
    },
    withLogging('media_list_fonts', async () =>
      textJson({
        builtin: BUILTIN_FONTS,
        user: listUserFonts(),
      }),
    ),
  )
}
