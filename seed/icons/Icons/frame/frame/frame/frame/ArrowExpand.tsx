import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowExpandInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowExpand({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8 20H4M4 20V16M4 20L8.5 15.5M16 4H20M20 4V8M20 4L15.5 8.5M4 8L4 4M4 4L8 4M4 4L8.5 8.5M20 16L20 20M20 20H16M20 20L15.5 15.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowExpand = memo(ArrowExpandInner)
ArrowExpand.displayName = 'ArrowExpand'