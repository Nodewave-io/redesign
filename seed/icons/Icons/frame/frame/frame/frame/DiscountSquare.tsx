import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DiscountSquareInner = forwardRef<SVGSVGElement, IconProps>(
  function DiscountSquare({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.3999 15.5999L15.5999 8.3999M8.9538 8.94924L8.93965 8.93495M15.0643 15.1226L15.0502 15.1083M2.3999 19.1999V4.7999C2.3999 3.47442 3.47442 2.3999 4.7999 2.3999H19.1999C20.5254 2.3999 21.5999 3.47442 21.5999 4.7999V19.1999C21.5999 20.5254 20.5254 21.5999 19.1999 21.5999H4.7999C3.47442 21.5999 2.3999 20.5254 2.3999 19.1999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const DiscountSquare = memo(DiscountSquareInner)
DiscountSquare.displayName = 'DiscountSquare'