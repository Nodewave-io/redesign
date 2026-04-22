import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlexAlignSpacedInner = forwardRef<SVGSVGElement, IconProps>(
  function FlexAlignSpaced({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.9375 16.5V7.5M8.0625 16.5V7.5M17.625 3L6.375 3C4.51104 3 3 4.51104 3 6.375L3 17.625C3 19.489 4.51104 21 6.375 21H17.625C19.489 21 21 19.489 21 17.625V6.375C21 4.51104 19.489 3 17.625 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlexAlignSpaced = memo(FlexAlignSpacedInner)
FlexAlignSpaced.displayName = 'FlexAlignSpaced'