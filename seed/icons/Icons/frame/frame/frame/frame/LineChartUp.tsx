import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LineChartUpInner = forwardRef<SVGSVGElement, IconProps>(
  function LineChartUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.39966 2.3999V21.5999H21.5997M7.19966 14.4L11.3997 10.2L14.3997 13.2L20.9997 6.60003M16.5094 5.9999H21.6006V11.0911" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LineChartUp = memo(LineChartUpInner)
LineChartUp.displayName = 'LineChartUp'