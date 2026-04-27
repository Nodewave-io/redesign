// Media Builder — shared types.
//
// The authoring model is a flat ordered list of layers per slide. Each
// layer declares its type, its position/size (in canvas units — see
// CANVAS below), and its type-specific props. A layer can set `spans`
// > 1 to bleed across N consecutive slides, which is the whole point
// of designing the carousel as one long strip.

// Categories are free-form strings — Tiago and Claude can invent any
// label. We ship a starter list for the UI dropdown but anything not
// in the list is still valid.
export const SUGGESTED_CATEGORIES: string[] = [
  'shapes',
  'gradients',
  'patterns',
  'icons',
  'photos',
  'logos',
  'components',
  'hero',
  'card',
  'chart',
  'quote',
  'stat',
  'dark',
  'light',
]

export type AssetKind = 'image' | 'component'

export type MediaAsset = {
  id: string
  kind: AssetKind
  name: string
  description: string | null
  usage_notes: string | null
  categories: string[]
  tags: string[]
  /** Image URL — null for component assets. */
  file_url: string | null
  /** Storage path in media-assets bucket — null for component assets. */
  storage_path: string | null
  /** TSX source — null for image assets. */
  source_code: string | null
  mime_type: string | null
  width: number | null
  height: number | null
  created_at: string
}

// Canvas coordinate system: every slide is 1000×1250 canvas units (4:5).
// We render at a scaled pixel size but the model is resolution-independent.
// Export @ 2160×2700 (2x of 1080×1350, Instagram native).
export const CANVAS = {
  W: 1000,
  H: 1250,
  EXPORT_W: 2160,
  EXPORT_H: 2700,
} as const

// A layer's position is measured in canvas units. `x` is 0 at the LEFT
// edge of its origin slide. When a layer `spans` > 1, it can extend
// freely past x=CANVAS.W into the next slide(s).
export type BaseLayer = {
  id: string
  kind: LayerKind
  /** The first slide this layer appears on. */
  slideIndex: number
  /** How many consecutive slides this layer bleeds through. Default 1. */
  spans?: number
  x: number
  y: number
  w: number
  h: number
  rotation?: number
  opacity?: number
  /** Higher renders on top. Defaults to authoring order. */
  z?: number
  locked?: boolean
}

export type LayerKind =
  | 'text'
  | 'shape'
  | 'image'
  | 'gradient'
  | 'icon'
  | 'code'

export type TextLayer = BaseLayer & {
  kind: 'text'
  text: string
  // Built-in aliases (display / mono / sans / geist / system) OR any
  // user font family registered from ~/.redesign/fonts/. The renderer
  // falls back to the literal family name for unknown keys.
  fontFamily?: string
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
  /** 0 = left→right, 90 = top→bottom, etc. */
  angle: number
  radius?: number
}

export type ImageLayer = BaseLayer & {
  kind: 'image'
  /** URL of the asset (from media-assets bucket, or any absolute URL). */
  url: string
  /** Optional cover/contain. Defaults to cover. */
  fit?: 'cover' | 'contain'
  radius?: number
}

export type IconLayer = BaseLayer & {
  kind: 'icon'
  /** SVG url from the icons category of the asset library. */
  url: string
  color?: string
}

/**
 * Free-form TSX layer. The `source` field is a single JSX expression
 * (not a component definition) that renders inside the layer's
 * bounding box. Transpiled with @babel/standalone at render time.
 * The code has access to a curated set of globals: React, `motion`
 * from framer-motion, `Icons` from lucide-react, `cn` for class
 * names, and any `props` the user defined for this layer.
 *
 * When a layer is imported from a library component, the template
 * source is *copied* here so edits don't affect the library.
 */
export type CodeLayer = BaseLayer & {
  kind: 'code'
  source: string
  /** Optional override background for the code layer's frame. */
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
  /** Per-slide background color. Falls back to post theme. */
  background?: string
}

export type Theme = 'dark' | 'light'

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

// Row shape coming back from the API. Historically the editor's
// Supabase path stored slides as a single JSON column shaped
// `{slides, layers}` — which is what `MediaPostRow.slides` reflected.
// The new server-side repo returns a FLAT shape (so MCP tools see
// `slides: Slide[]` and `layers: Layer[]` directly). Accept either.
export type MediaPostRow = {
  id: string
  title: string
  page_count: number
  aspect_ratio: string
  theme: Theme
  slides: Slide[] | { slides: Slide[]; layers: Layer[] }
  layers?: Layer[]
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}

export function postFromRow(row: MediaPostRow): MediaPost {
  // Two cases. Flat (new): slides is an array, layers is its own field.
  // Wrapped (legacy): slides is `{slides, layers}` and outer layers is
  // empty/missing. Detect by inspecting the runtime shape.
  let slides: Slide[]
  let layers: Layer[]
  if (Array.isArray(row.slides)) {
    slides = row.slides
    layers = row.layers ?? []
  } else {
    slides = row.slides?.slides ?? []
    layers = row.slides?.layers ?? row.layers ?? []
  }
  return {
    id: row.id,
    title: row.title,
    page_count: row.page_count,
    aspect_ratio: row.aspect_ratio,
    theme: row.theme,
    slides,
    layers,
    thumbnail_url: row.thumbnail_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function postToDbSlides(post: Pick<MediaPost, 'slides' | 'layers'>) {
  return { slides: post.slides, layers: post.layers }
}

export function createSlide(): Slide {
  return { id: cryptoId() }
}

export function createEmptyPost(pageCount = 3, theme: Theme = 'dark'): Pick<
  MediaPost,
  'title' | 'page_count' | 'aspect_ratio' | 'theme' | 'slides' | 'layers'
> {
  return {
    title: 'Untitled post',
    page_count: pageCount,
    aspect_ratio: '4:5',
    theme,
    slides: Array.from({ length: pageCount }, () => createSlide()),
    layers: [],
  }
}

export function cryptoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Theme tokens — match the site's dark/light backgrounds so canvases
// feel native when embedded back on the blog or in an OG image.
export function themeColors(theme: Theme) {
  if (theme === 'dark') {
    return {
      bg: '#0A0A0A',
      fg: '#F5F5F5',
      muted: 'rgba(245,245,245,0.55)',
      accent: '#0A80FE',
    }
  }
  return {
    bg: '#FAFAFA',
    fg: '#0F1211',
    muted: 'rgba(15,18,17,0.55)',
    accent: '#0A80FE',
  }
}
