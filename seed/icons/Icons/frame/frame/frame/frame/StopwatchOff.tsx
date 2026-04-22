import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const StopwatchOffInner = forwardRef<SVGSVGElement, IconProps>(
  function StopwatchOff({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 3.68696L20.9999 22.287M18.2608 6.85217L20.3477 4.76522M20.3477 4.76522L19.0956 3.51304M20.3477 4.76522L21.5999 6.01739M9.4999 2H14.4999M5.4216 8C4.22059 9.47819 3.4999 11.3685 3.4999 13.4286C3.4999 18.1624 7.30548 22 11.9999 22C14.0974 22 16.0175 21.2339 17.4999 19.964M19.9999 16.3319C20.3235 15.4252 20.4999 14.4477 20.4999 13.4286C20.4999 8.6947 16.6943 4.85714 11.9999 4.85714C10.9439 4.85714 9.93278 5.05135 8.9999 5.40627" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const StopwatchOff = memo(StopwatchOffInner)
StopwatchOff.displayName = 'StopwatchOff'