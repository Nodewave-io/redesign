import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlexRowsInner = forwardRef<SVGSVGElement, IconProps>(
  function FlexRows({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.0625 9.75V6.9375M13.6875 9.75V6.9375M10.3125 17.0625V14.25M6.9375 17.0625V14.25M10.3125 9.75V6.9375M6.9375 9.75L6.9375 6.9375M17.625 3L6.375 3C4.51104 3 3 4.51104 3 6.375C3 8.23896 3 15.761 3 17.625C3 19.489 4.51104 21 6.375 21C6.375 21 15.761 21 17.625 21C19.489 21 21 19.489 21 17.625V6.375C21 4.51104 19.489 3 17.625 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlexRows = memo(FlexRowsInner)
FlexRows.displayName = 'FlexRows'