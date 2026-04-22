import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlexAlignTopInner = forwardRef<SVGSVGElement, IconProps>(
  function FlexAlignTop({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.5 7.5L7.5 7.5M16.5 10.875L7.5 10.875M3 6.375L3 17.625C3 19.489 4.51104 21 6.375 21H17.625C19.489 21 21 19.489 21 17.625V6.375C21 4.51104 19.489 3 17.625 3L6.375 3C4.51104 3 3 4.51104 3 6.375Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlexAlignTop = memo(FlexAlignTopInner)
FlexAlignTop.displayName = 'FlexAlignTop'