import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LineChartDown2Inner = forwardRef<SVGSVGElement, IconProps>(
  function LineChartDown2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 2.3999V21.5999H21.5999M7.1999 8.3999L11.5999 12.218L14.7427 9.49079L20.3999 14.3999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LineChartDown2 = memo(LineChartDown2Inner)
LineChartDown2.displayName = 'LineChartDown2'