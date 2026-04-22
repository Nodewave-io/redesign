import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const IndentIncreaseInner = forwardRef<SVGSVGElement, IconProps>(
  function IndentIncrease({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 4.79999H8.3999M21.5999 9.59999H13.1999M21.5999 19.2H8.3999M2.3999 7.19999L7.1999 12L2.3999 16.8M21.5999 14.4H13.1999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const IndentIncrease = memo(IndentIncreaseInner)
IndentIncrease.displayName = 'IndentIncrease'