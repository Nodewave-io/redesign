import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowUpRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowUpRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.45802 7.08031L16.98 7.08019M16.98 7.08019L16.98 15.481M16.98 7.08019L7.08052 16.9797" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowUpRight = memo(ArrowUpRightInner)
ArrowUpRight.displayName = 'ArrowUpRight'