// Domain types — mirrored from nw-site/app/admin/media/_lib/types.ts
// and nw-site/mcp/src/types.ts. The Redesign package is standalone so
// we don't path-import across repos; if you add a layer kind upstream,
// mirror it here too.

export const CANVAS = {
  W: 1000,
  H: 1250,
  EXPORT_W: 2160,
  EXPORT_H: 2700,
} as const

export type AssetKind = 'image' | 'component'
export type Theme = 'dark' | 'light'
export type LayerKind = 'text' | 'shape' | 'image' | 'gradient' | 'icon' | 'code'

export type MediaAsset = {
  id: string
  kind: AssetKind
  name: string
  description: string | null
  usage_notes: string | null
  categories: string[]
  tags: string[]
  file_url: string | null
  storage_path: string | null
  source_code: string | null
  mime_type: string | null
  width: number | null
  height: number | null
  created_at: string
}

export type BaseLayer = {
  id: string
  kind: LayerKind
  slideIndex: number
  spans?: number
  x: number
  y: number
  w: number
  h: number
  rotation?: number
  opacity?: number
  z?: number
  locked?: boolean
}

export type TextLayer = BaseLayer & {
  kind: 'text'
  text: string
  fontFamily?: 'display' | 'mono' | 'sans'
  fontSize: number
  fontWeight: 400 | 500 | 600 | 700
  color: string
  align: 'left' | 'center' | 'right'
  lineHeight?: number
  letterSpacing?: number
}

export type ShapeLayer = BaseLayer & {
  kind: 'shape'
  shape: 'rect' | 'circle' | 'pill'
  fill: string
  stroke?: string
  strokeWidth?: number
  radius?: number
}

export type GradientLayer = BaseLayer & {
  kind: 'gradient'
  from: string
  to: string
  angle: number
  radius?: number
}

export type ImageLayer = BaseLayer & {
  kind: 'image'
  url: string
  fit?: 'cover' | 'contain'
  radius?: number
}

export type IconLayer = BaseLayer & {
  kind: 'icon'
  url: string
  color?: string
}

export type CodeLayer = BaseLayer & {
  kind: 'code'
  source: string
  frameBg?: string
}

export type Layer =
  | TextLayer
  | ShapeLayer
  | GradientLayer
  | ImageLayer
  | IconLayer
  | CodeLayer

export type Slide = {
  id: string
  background?: string
}

export type MediaPost = {
  id: string
  title: string
  page_count: number
  aspect_ratio: string
  theme: Theme
  slides: Slide[]
  layers: Layer[]
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}

export type RevisionSource = 'editor' | 'mcp'

export type MediaPostRevision = {
  id: string
  post_id: string
  snapshot: MediaPost
  source: RevisionSource
  note: string | null
  created_at: string
}

export type McpLogStatus = 'ok' | 'error'

export type McpLogRow = {
  tool_name: string
  args_digest: string
  post_id: string | null
  status: McpLogStatus
  duration_ms: number
  error_message: string | null
}
