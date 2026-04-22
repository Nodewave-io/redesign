import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlexAlignLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function FlexAlignLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.5 7.5L7.5 16.5M10.875 7.5L10.875 16.5M6.375 21H17.625C19.489 21 21 19.489 21 17.625V6.375C21 4.51104 19.489 3 17.625 3H6.375C4.51104 3 3 4.51104 3 6.375V17.625C3 19.489 4.51104 21 6.375 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlexAlignLeft = memo(FlexAlignLeftInner)
FlexAlignLeft.displayName = 'FlexAlignLeft'