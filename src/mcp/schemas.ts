// Zod schemas for layer shapes + common tool inputs. Used as the
// wire-level validation boundary so a malformed Claude request fails
// loudly instead of corrupting a post.
//
// The `layerInput*` variants omit `id` — the server generates UUIDs
// on insert. `layerPatch` makes every field optional so update tools
// can accept partial patches.

import { z } from 'zod'

const base = {
  slideIndex: z.number().int().min(0),
  spans: z.number().int().min(1).optional(),
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive(),
  rotation: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  z: z.number().int().optional(),
  locked: z.boolean().optional(),
}

export const textLayerInput = z.object({
  kind: z.literal('text'),
  ...base,
  text: z.string(),
  // Built-in aliases (display / mono / sans / geist / system) OR any
  // user font family discoverable via media_list_fonts. Free-form
  // string so user-supplied .ttf/.woff2 names work without redeploy.
  fontFamily: z.string().min(1).max(120).optional(),
  fontSize: z.number().positive(),
  fontWeight: z.union([z.literal(400), z.literal(500), z.literal(600), z.literal(700)]),
  color: z.string(),
  align: z.enum(['left', 'center', 'right']),
  lineHeight: z.number().optional(),
  letterSpacing: z.number().optional(),
})

export const shapeLayerInput = z.object({
  kind: z.literal('shape'),
  ...base,
  shape: z.enum(['rect', 'circle', 'pill']),
  fill: z.string(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  radius: z.number().optional(),
})

export const gradientLayerInput = z.object({
  kind: z.literal('gradient'),
  ...base,
  from: z.string(),
  to: z.string(),
  angle: z.number(),
  radius: z.number().optional(),
})

export const imageLayerInput = z.object({
  kind: z.literal('image'),
  ...base,
  url: z.string(),
  fit: z.enum(['cover', 'contain']).optional(),
  radius: z.number().optional(),
})

export const iconLayerInput = z.object({
  kind: z.literal('icon'),
  ...base,
  url: z.string(),
  color: z.string().optional(),
})

export const codeLayerInput = z.object({
  kind: z.literal('code'),
  ...base,
  source: z.string(),
  frameBg: z.string().optional(),
})

export const layerInput = z.discriminatedUnion('kind', [
  textLayerInput,
  shapeLayerInput,
  gradientLayerInput,
  imageLayerInput,
  iconLayerInput,
  codeLayerInput,
])

// Every-field-optional patch. We don't enforce kind-specific fields on
// update because the caller might be flipping a single field (e.g.
// only x). The handler merges onto the existing layer, so shape stays
// consistent.
export const layerPatch = z
  .object({
    slideIndex: z.number().int().min(0).optional(),
    spans: z.number().int().min(1).optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    w: z.number().positive().optional(),
    h: z.number().positive().optional(),
    rotation: z.number().optional(),
    opacity: z.number().min(0).max(1).optional(),
    z: z.number().int().optional(),
    locked: z.boolean().optional(),
    text: z.string().optional(),
    fontFamily: z.string().min(1).max(120).optional(),
    fontSize: z.number().positive().optional(),
    fontWeight: z
      .union([z.literal(400), z.literal(500), z.literal(600), z.literal(700)])
      .optional(),
    color: z.string().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    lineHeight: z.number().optional(),
    letterSpacing: z.number().optional(),
    shape: z.enum(['rect', 'circle', 'pill']).optional(),
    fill: z.string().optional(),
    stroke: z.string().optional(),
    strokeWidth: z.number().optional(),
    radius: z.number().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    angle: z.number().optional(),
    url: z.string().optional(),
    fit: z.enum(['cover', 'contain']).optional(),
    source: z.string().optional(),
    frameBg: z.string().optional(),
  })
  .strict()

export const themeSchema = z.enum(['dark', 'light'])
