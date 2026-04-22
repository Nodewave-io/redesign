import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LayersInner = forwardRef<SVGSVGElement, IconProps>(
  function Layers({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 6.92554L21.5999 12.0001L11.9999 17.0746L2.3999 12.0001L11.9999 6.92554Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Layers = memo(LayersInner)
Layers.displayName = 'Layers'