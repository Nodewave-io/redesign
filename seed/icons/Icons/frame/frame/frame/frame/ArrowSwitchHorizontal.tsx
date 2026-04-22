import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowSwitchHorizontalInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowSwitchHorizontal({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.375 9.75L3 6.375M3 6.375L6.375 3M3 6.375H21M17.625 14.25L21 17.625M21 17.625L17.625 21M21 17.625H3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowSwitchHorizontal = memo(ArrowSwitchHorizontalInner)
ArrowSwitchHorizontal.displayName = 'ArrowSwitchHorizontal'