import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.20005 15.0864L9.51406 20.4004M9.51406 20.4004L14.8281 15.0864M9.51406 20.4004L9.51406 7.60039C9.51406 5.39126 11.3049 3.60039 13.5141 3.60039L19.8 3.60039" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownLeft = memo(ArrowDownLeftInner)
ArrowDownLeft.displayName = 'ArrowDownLeft'