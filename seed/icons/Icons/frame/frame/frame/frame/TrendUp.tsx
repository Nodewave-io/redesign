import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TrendUpInner = forwardRef<SVGSVGElement, IconProps>(
  function TrendUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 16.7999L7.7759 11.6307L12.3839 16.0615L21.5999 7.19995M21.5999 7.19995H14.6879M21.5999 7.19995V13.8461" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TrendUp = memo(TrendUpInner)
TrendUp.displayName = 'TrendUp'