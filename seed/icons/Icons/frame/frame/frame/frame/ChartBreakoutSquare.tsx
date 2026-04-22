import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ChartBreakoutSquareInner = forwardRef<SVGSVGElement, IconProps>(
  function ChartBreakoutSquare({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.3376 4.02217H4.66783C3.41529 4.02217 2.3999 5.03755 2.3999 6.29009V19.8976C2.3999 21.1502 3.41529 22.1656 4.66783 22.1656H18.2754C19.5279 22.1656 20.5433 21.1502 20.5433 19.8976V13.0939M2.96688 13.1599C7.50273 13.1599 13.7395 13.7269 14.3065 9.75802M14.3065 9.75802H10.9046M14.3065 9.75802V13.8342M14.2291 1.83423V4.2812M21.5999 9.20498H19.1529M19.332 4.10215L17.7084 5.72311" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ChartBreakoutSquare = memo(ChartBreakoutSquareInner)
ChartBreakoutSquare.displayName = 'ChartBreakoutSquare'