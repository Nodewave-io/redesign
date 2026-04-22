import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SquareInner = forwardRef<SVGSVGElement, IconProps>(
  function Square({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.9999 2.3999C19.9881 2.3999 21.5999 4.01168 21.5999 5.9999V18C21.5999 19.9882 19.9881 21.6 17.9999 21.6H5.9999C4.01168 21.6 2.3999 19.9882 2.3999 18L2.3999 5.9999C2.3999 4.01168 4.01168 2.3999 5.9999 2.3999L17.9999 2.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Square = memo(SquareInner)
Square.displayName = 'Square'