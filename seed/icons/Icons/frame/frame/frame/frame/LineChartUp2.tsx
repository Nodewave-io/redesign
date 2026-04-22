import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LineChartUp2Inner = forwardRef<SVGSVGElement, IconProps>(
  function LineChartUp2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 2.3999V21.5999H21.5999M7.1999 14.4L11.3999 10.2L14.3999 13.2L19.8 7.7999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LineChartUp2 = memo(LineChartUp2Inner)
LineChartUp2.displayName = 'LineChartUp2'