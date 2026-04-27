// Read-only tools for media_posts. Safe to call repeatedly; no writes,
// no concurrency guard needed. Every handler wraps in withLogging so
// even "just looking" shows up in media_mcp_log — makes it easy to see
// what Claude was inspecting before it decided to edit.

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { withLogging } from '../log.js'
import { textJson } from '../write-helpers.js'
import { getPost, listPosts } from '../../db/repo.js'
import type { Layer, MediaPost } from '../../db/types.js'

export function registerPostReadTools(server: McpServer): void {
  server.registerTool(
    'media_list_posts',
    {
      description:
        'List media posts, most-recently-updated first. Returns id/title/theme/page_count/updated_at/thumbnail_url/collection_id; use media_get_post for full layer data. Pass `collection_id` to scope to a single collection.',
      inputSchema: {
        collection_id: z.string().uuid().optional(),
      },
    },
    withLogging(
      'media_list_posts',
      async (args: { collection_id?: string }) =>
        textJson(listPosts(args.collection_id ? { collection_id: args.collection_id } : undefined)),
    ),
  )

  server.registerTool(
    'media_get_post',
    {
      description:
        'Fetch a single post with all slides + layers. Always call this before an edit so you have the latest updated_at for the optimistic-concurrency guard.',
      inputSchema: { id: z.string().uuid() },
    },
    withLogging('media_get_post', async ({ id }: { id: string }) => textJson(getPost(id))),
  )

  server.registerTool(
    'media_describe_post',
    {
      description:
        "Prose summary of a post: slide-by-slide, every layer with its kind, position, and key props. This is the canvas-as-text view so you can 'see' a post without a screenshot.",
      inputSchema: { id: z.string().uuid() },
    },
    withLogging('media_describe_post', async ({ id }: { id: string }) => ({
      content: [{ type: 'text', text: describe(getPost(id)) }],
    })),
  )
}

function describe(post: MediaPost): string {
  const lines: string[] = [
    `Post "${post.title}" (${post.id})`,
    `  theme: ${post.theme}  slides: ${post.page_count}  updated_at: ${post.updated_at}`,
    '',
  ]
  for (let i = 0; i < post.slides.length; i++) {
    const slide = post.slides[i]
    const onSlide = post.layers.filter((l) => {
      const span = l.spans ?? 1
      return l.slideIndex <= i && i < l.slideIndex + span
    })
    lines.push(
      `Slide ${i + 1}${slide.background ? ` (bg ${slide.background})` : ''}: ${onSlide.length} layer${onSlide.length === 1 ? '' : 's'}`,
    )
    for (const l of onSlide) lines.push(`  · ${describeLayer(l, i)}`)
    lines.push('')
  }
  return lines.join('\n').trimEnd()
}

function describeLayer(l: Layer, currentSlide: number): string {
  const span = l.spans && l.spans > 1 ? ` spans ${l.spans}` : ''
  const bleed = l.slideIndex < currentSlide ? ` (bleed from slide ${l.slideIndex + 1})` : ''
  const pos = `x=${l.x} y=${l.y} w=${l.w} h=${l.h}`
  const z = l.z != null ? ` z=${l.z}` : ''
  const op = l.opacity != null && l.opacity !== 1 ? ` op=${l.opacity}` : ''
  const rot = l.rotation ? ` rot=${l.rotation}` : ''
  const common = `[${l.id.slice(0, 8)}] ${l.kind}${span}${bleed}  ${pos}${z}${op}${rot}`
  switch (l.kind) {
    case 'text':
      return `${common}  "${truncate(l.text, 60)}" (${l.fontSize}px w${l.fontWeight} ${l.color})`
    case 'shape':
      return `${common}  ${l.shape} fill=${l.fill}${l.stroke ? ` stroke=${l.stroke}` : ''}`
    case 'gradient':
      return `${common}  ${l.from} → ${l.to} @ ${l.angle}deg`
    case 'image':
      return `${common}  url=${shortUrl(l.url)} fit=${l.fit ?? 'cover'}`
    case 'icon':
      return `${common}  icon ${shortUrl(l.url)}${l.color ? ` color=${l.color}` : ''}`
    case 'code':
      return `${common}  code (${l.source.length} chars)`
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

function shortUrl(u: string): string {
  return u.length > 60 ? `…${u.slice(-40)}` : u
}
