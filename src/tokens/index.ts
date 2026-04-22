// Design tokens — single source of truth for the visual identity.
//
// The editor and the landing page both read from here. When the v4
// landing lands, update these values and nothing else should need to
// change in the editor (colors, spacing, radii, type all derived).
//
// Values marked PLACEHOLDER are holdovers from the old nw-site
// admin surface; overwrite them once the v4 landing is finalized.

// ─── Color system ─────────────────────────────────────────────────
// Three surfaces (background, card, elevated), three text tones
// (primary, muted, dim), and a single accent. Everything else is
// derived: borders are surface + 8-12% alpha, focus rings are accent
// at 40% alpha, hovers are accent-tinted.

export const color = {
  // Surfaces
  bg: '#0A0A0A',            // page background (PLACEHOLDER — v1/v3 variant)
  surface: '#141414',       // card / panel
  elevated: '#1A1A1A',      // hover / active panel
  // Text
  fg: '#FFFFFF',            // primary text
  muted: 'rgba(255,255,255,0.60)',  // secondary text
  dim: 'rgba(255,255,255,0.40)',    // captions, eyebrows
  // Lines
  border: 'rgba(43,38,38,1)',       // default border — PLACEHOLDER
  borderSubtle: 'rgba(255,255,255,0.08)',
  // Interactive accent (TODO: v4 landing will pick final value —
  // v1=#FF5A1F, v2=#F04E23, v3=#FF6B2C. Update once locked.)
  accent: '#FF5A1F',
  accentInk: '#0A0A0A',     // text placed ON the accent bg
  // Semantic
  success: '#22C55E',
  danger: '#DC2626',
  warn: '#F59E0B',
} as const

// ─── Radii ────────────────────────────────────────────────────────
export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 9999,
} as const

// ─── Spacing scale (px) ───────────────────────────────────────────
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const

// ─── Typography ───────────────────────────────────────────────────
// Font stacks. The landing uses three CSS custom properties set in
// the Next root layout: --font-display, --font-mono-accent, --font-sans.
// Editor should consume these same variables so the two surfaces feel
// like the same product.
export const fontStack = {
  display: 'var(--font-display), ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: 'var(--font-mono-accent), ui-monospace, SFMono-Regular, Menlo, monospace',
  sans: 'var(--font-sans), var(--font-display), system-ui, sans-serif',
} as const

// Type scale in px, matching the landing's editorial scale.
export const fontSize = {
  micro: 10,    // mono eyebrows
  caption: 12,  // mono captions
  small: 13,
  body: 15,
  large: 18,
  h5: 22,
  h4: 28,
  h3: 36,
  h2: 48,
  h1: 72,
  display: 112,  // landing hero
} as const

export const fontWeight = {
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const tracking = {
  tight: '-0.045em',  // landing hero
  normal: '-0.01em',
  wide: '0.15em',     // mono caps
  wider: '0.25em',    // nav labels
  widest: '0.3em',    // eyebrows
} as const

// ─── Motion ───────────────────────────────────────────────────────
export const motion = {
  fast: '120ms',
  base: '200ms',
  slow: '320ms',
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

// ─── Elevation (box-shadow) ───────────────────────────────────────
export const shadow = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.2)',
  md: '0 8px 24px rgba(0,0,0,0.32)',
  lg: '0 24px 60px rgba(0,0,0,0.45)',
  // Glow around a focused interactive on dark.
  focus: `0 0 0 2px ${color.accent}33`,
} as const

// ─── Layout breakpoints ───────────────────────────────────────────
// Match the Tailwind defaults the landing uses. Editor code that needs
// to branch on viewport can import these.
export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

// ─── Re-exports ───────────────────────────────────────────────────
export const tokens = {
  color,
  radius,
  space,
  fontStack,
  fontSize,
  fontWeight,
  tracking,
  motion,
  shadow,
  breakpoint,
} as const

export type Tokens = typeof tokens
