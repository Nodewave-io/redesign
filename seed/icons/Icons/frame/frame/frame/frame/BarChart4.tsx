import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BarChart4Inner = forwardRef<SVGSVGElement, IconProps>(
  function BarChart4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 20.7V7.90005M8.7999 20.7V13.2334M15.1999 20.7V3.30005M21.5999 20.7V7.90005" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BarChart4 = memo(BarChart4Inner)
BarChart4.displayName = 'BarChart4'