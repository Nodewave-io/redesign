import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TrendDownInner = forwardRef<SVGSVGElement, IconProps>(
  function TrendDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 7.20005L7.7759 12.3693L12.3839 7.93851L21.5999 16.8M21.5999 16.8H14.6879M21.5999 16.8V10.1539" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TrendDown = memo(TrendDownInner)
TrendDown.displayName = 'TrendDown'