import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CardMinusInner = forwardRef<SVGSVGElement, IconProps>(
  function CardMinus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.6547 18.8999H4.05504C2.72959 18.8999 1.65508 17.8254 1.65504 16.5L1.65479 7.50016C1.65475 6.17465 2.72928 5.1001 4.05479 5.1001H18.4542C19.7798 5.1001 20.8543 6.17399 20.8543 7.49951L20.8543 11.7001M2.25432 9.29995H20.2543M17.2539 16.0457L22.3453 16.0454" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CardMinus = memo(CardMinusInner)
CardMinus.displayName = 'CardMinus'