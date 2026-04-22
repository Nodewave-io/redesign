import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ChartBreakoutCircleInner = forwardRef<SVGSVGElement, IconProps>(
  function ChartBreakoutCircle({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.96688 13.7256C7.50273 13.7256 13.7395 14.2926 14.3065 10.3237M14.3065 10.3237H10.9046M14.3065 10.3237V14.3999M14.2291 2.3999V4.84687M21.5999 9.77066H19.1529M19.332 4.66783L17.7084 6.28878M9.5999 2.70234C5.45936 3.76805 2.3999 7.52669 2.3999 11.9999C2.3999 17.3018 6.69797 21.5999 11.9999 21.5999C16.6866 21.5999 20.5889 18.2414 21.4314 13.7999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ChartBreakoutCircle = memo(ChartBreakoutCircleInner)
ChartBreakoutCircle.displayName = 'ChartBreakoutCircle'