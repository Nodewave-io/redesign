import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TrendDown2Inner = forwardRef<SVGSVGElement, IconProps>(
  function TrendDown2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.6999 7.36983L17.7001 17.7M17.7001 17.7H7.51675M17.7001 17.7L6.30005 6.30005" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TrendDown2 = memo(TrendDown2Inner)
TrendDown2.displayName = 'TrendDown2'