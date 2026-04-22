// Tailwind v3 preset that exposes the design tokens as classes.
// Load from the editor's tailwind.config.ts via `presets: [redesignPreset]`
// and every token stays in sync across the landing and the editor.
//
// Keep this file pure (no runtime imports of React, Node, etc) so it
// can be consumed from tailwind.config.ts in any environment.

import { color, fontSize, radius, space, fontStack, shadow, tracking } from './index.js'

export const redesignPreset = {
  theme: {
    extend: {
      colors: {
        bg: color.bg,
        surface: color.surface,
        elevated: color.elevated,
        fg: color.fg,
        muted: color.muted,
        dim: color.dim,
        accent: color.accent,
        'accent-ink': color.accentInk,
        border: color.border,
        'border-subtle': color.borderSubtle,
        success: color.success,
        danger: color.danger,
        warn: color.warn,
      },
      borderRadius: {
        sm: `${radius.sm}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
        xl: `${radius.xl}px`,
      },
      spacing: Object.fromEntries(
        Object.entries(space).map(([k, v]) => [k, `${v}px`]),
      ),
      fontFamily: {
        display: [fontStack.display],
        mono: [fontStack.mono],
        sans: [fontStack.sans],
      },
      fontSize: Object.fromEntries(
        Object.entries(fontSize).map(([k, v]) => [k, `${v}px`]),
      ),
      letterSpacing: {
        tightest: tracking.tight,
        tight: tracking.normal,
        wide: tracking.wide,
        wider: tracking.wider,
        widest: tracking.widest,
      },
      boxShadow: {
        sm: shadow.sm,
        md: shadow.md,
        lg: shadow.lg,
        focus: shadow.focus,
      },
    },
  },
}

export default redesignPreset
