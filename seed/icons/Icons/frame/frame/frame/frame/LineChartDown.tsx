import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LineChartDownInner = forwardRef<SVGSVGElement, IconProps>(
  function LineChartDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 2.3999V21.5999H21.5999M7.1999 5.9999L11.3996 10.1998L14.3994 7.19988L20.999 13.7998M16.5091 14.3999H21.5999V9.30881" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LineChartDown = memo(LineChartDownInner)
LineChartDown.displayName = 'LineChartDown'