// Layer renderer — pure function of (layer, theme). Used both in the
// live editor canvas and by the export endpoint so the PNG matches
// what you see 1:1. No drag handles, no selection chrome here; those
// live in the editor overlay.

import type { Layer, Theme } from './types'
import { themeColors } from './types'
import { CodeRunner } from './code-runtime'

const FONT_FAMILY_MAP = {
  display: 'var(--font-display), Manrope, system-ui, sans-serif',
  mono: 'var(--font-mono-accent), "Space Mono", ui-monospace, monospace',
  sans: 'Inter, system-ui, -apple-system, sans-serif',
}

export function LayerNode({ layer, theme }: { layer: Layer; theme: Theme }) {
  const opacity = layer.opacity ?? 1
  const rotation = layer.rotation ?? 0
  const transform = rotation ? `rotate(${rotation}deg)` : undefined
  const style: React.CSSProperties = {
    position: 'absolute',
    left: layer.x,
    top: layer.y,
    width: layer.w,
    height: layer.h,
    opacity,
    transform,
    transformOrigin: 'center center',
    pointerEvents: 'none',
  }

  switch (layer.kind) {
    case 'text': {
      const family =
        FONT_FAMILY_MAP[layer.fontFamily ?? 'display'] ?? FONT_FAMILY_MAP.display
      return (
        <div
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              layer.align === 'center'
                ? 'center'
                : layer.align === 'right'
                  ? 'flex-end'
                  : 'flex-start',
            textAlign: layer.align,
            color: layer.color,
            fontFamily: family,
            fontSize: layer.fontSize,
            fontWeight: layer.fontWeight,
            lineHeight: layer.lineHeight ?? 1.1,
            letterSpacing: layer.letterSpacing ?? 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {layer.text}
        </div>
      )
    }
    case 'shape': {
      const radius =
        layer.shape === 'circle'
          ? '50%'
          : layer.shape === 'pill'
            ? 9999
            : (layer.radius ?? 0)
      return (
        <div
          style={{
            ...style,
            background: layer.fill,
            borderRadius: radius,
            boxSizing: 'border-box',
            border: layer.stroke
              ? `${layer.strokeWidth ?? 2}px solid ${layer.stroke}`
              : undefined,
          }}
        />
      )
    }
    case 'gradient': {
      return (
        <div
          style={{
            ...style,
            background: `linear-gradient(${layer.angle}deg, ${layer.from}, ${layer.to})`,
            borderRadius: layer.radius ?? 0,
          }}
        />
      )
    }
    case 'image': {
      return (
        <div
          style={{
            ...style,
            backgroundImage: `url("${layer.url}")`,
            backgroundSize: layer.fit === 'contain' ? 'contain' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: layer.radius ?? 0,
          }}
        />
      )
    }
    case 'icon': {
      // Rendered as an <img> so we can tint via CSS filter isn't possible;
      // for now we just render the SVG raw. Color tinting will come when
      // we support mask-image — leave a TODO.
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={layer.url}
          alt=""
          style={{
            ...style,
            objectFit: 'contain',
            filter:
              layer.color && theme === 'dark' ? 'brightness(0) invert(1)' : undefined,
          }}
        />
      )
    }
    case 'code': {
      return (
        <div
          style={{
            ...style,
            background: layer.frameBg ?? 'transparent',
            overflow: 'hidden',
          }}
        >
          <CodeRunner source={layer.source} />
        </div>
      )
    }
  }
}

export function SlideBackground({
  theme,
  background,
}: {
  theme: Theme
  background?: string
}) {
  const bg = background ?? themeColors(theme).bg
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        pointerEvents: 'none',
      }}
    />
  )
}
