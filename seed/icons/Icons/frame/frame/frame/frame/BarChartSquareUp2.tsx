import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BarChartSquareUp2Inner = forwardRef<SVGSVGElement, IconProps>(
  function BarChartSquareUp2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.50059 14.0002L10.7006 9.8002L13.7006 12.8002L17.3006 9.2002M4.4 21.2C3.07451 21.2 2 20.1255 2 18.8V4.4C2 3.07452 3.07452 2 4.4 2H18.8C20.1255 2 21.2 3.07452 21.2 4.4V18.8C21.2 20.1255 20.1255 21.2 18.8 21.2H4.4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BarChartSquareUp2 = memo(BarChartSquareUp2Inner)
BarChartSquareUp2.displayName = 'BarChartSquareUp2'