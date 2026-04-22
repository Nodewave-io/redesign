import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRotateLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRotateLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.87115 14.5C5.88914 17.6939 8.80463 20 12.2424 20C16.5268 20 20 16.4183 20 12C20 7.58172 16.5268 4 12.2424 4C9.37103 4 6.86399 5.60879 5.52267 8M7.87879 9H4V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRotateLeft = memo(ArrowRotateLeftInner)
ArrowRotateLeft.displayName = 'ArrowRotateLeft'