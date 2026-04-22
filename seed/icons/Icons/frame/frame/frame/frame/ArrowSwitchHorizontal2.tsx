import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowSwitchHorizontal2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowSwitchHorizontal2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.25 6.375L17.625 3M17.625 3L21 6.375M17.625 3L17.625 21M9.75 17.625L6.375 21M6.375 21L3 17.625M6.375 21L6.375 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowSwitchHorizontal2 = memo(ArrowSwitchHorizontal2Inner)
ArrowSwitchHorizontal2.displayName = 'ArrowSwitchHorizontal2'