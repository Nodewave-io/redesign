import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MarkerInner = forwardRef<SVGSVGElement, IconProps>(
  function Marker({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 21H7.90909M5.45455 12.3913V3H21L18.5455 7.69565L21 12.3913H5.45455ZM5.45455 12.3913V20.2174" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Marker = memo(MarkerInner)
Marker.displayName = 'Marker'