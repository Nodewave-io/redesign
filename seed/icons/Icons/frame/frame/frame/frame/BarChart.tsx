import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BarChartInner = forwardRef<SVGSVGElement, IconProps>(
  function BarChart({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.80005 19.2001V16.8001M12 19.2001V10.8M19.2001 19.2001V4.80005" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BarChart = memo(BarChartInner)
BarChart.displayName = 'BarChart'