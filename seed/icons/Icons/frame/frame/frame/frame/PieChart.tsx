import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PieChartInner = forwardRef<SVGSVGElement, IconProps>(
  function PieChart({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 2.3999C17.3019 2.39993 21.5999 6.69802 21.5999 11.9999C21.5999 17.3019 17.3018 21.6 11.9999 21.6C6.69797 21.6 2.3999 17.3019 2.3999 11.9999C2.3999 6.69798 6.698 2.39987 12 2.3999ZM12 2.3999L11.9999 12M11.9999 12L5.3999 18.6M11.9999 12L5.3999 5.39996" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const PieChart = memo(PieChartInner)
PieChart.displayName = 'PieChart'