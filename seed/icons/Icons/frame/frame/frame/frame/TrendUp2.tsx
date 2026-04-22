import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TrendUp2Inner = forwardRef<SVGSVGElement, IconProps>(
  function TrendUp2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.36983 6.3002L17.7001 6.30005M17.7001 6.30005V16.4833M17.7001 6.30005L6.30005 17.7001" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TrendUp2 = memo(TrendUp2Inner)
TrendUp2.displayName = 'TrendUp2'