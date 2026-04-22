import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const IndentDecreaseInner = forwardRef<SVGSVGElement, IconProps>(
  function IndentDecrease({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 4.79999H13.1999M21.5999 9.59999H10.7999M21.5999 19.2H13.1999M7.1999 7.19999L2.3999 12L7.1999 16.8M21.5999 14.4H10.7999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const IndentDecrease = memo(IndentDecreaseInner)
IndentDecrease.displayName = 'IndentDecrease'