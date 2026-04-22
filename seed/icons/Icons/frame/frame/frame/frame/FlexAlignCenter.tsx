import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlexAlignCenterInner = forwardRef<SVGSVGElement, IconProps>(
  function FlexAlignCenter({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.6875 16.5V7.5M10.3125 16.5V7.5M17.625 3L6.375 3C4.51104 3 3 4.51104 3 6.375L3 17.625C3 19.489 4.51104 21 6.375 21H17.625C19.489 21 21 19.489 21 17.625V6.375C21 4.51104 19.489 3 17.625 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlexAlignCenter = memo(FlexAlignCenterInner)
FlexAlignCenter.displayName = 'FlexAlignCenter'