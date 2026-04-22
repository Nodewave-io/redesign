import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const StopwatchSnoozeInner = forwardRef<SVGSVGElement, IconProps>(
  function StopwatchSnooze({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.2609 6.85217L20.3478 4.76522M20.3478 4.76522L19.0957 3.51304M20.3478 4.76522L21.6 6.01739M9.41296 10.9129H14.4999L9.41296 15.9999H14.4999M9.5 2H14.5M20.5 13.4286C20.5 18.1624 16.6944 22 12 22C7.30558 22 3.5 18.1624 3.5 13.4286C3.5 8.6947 7.30558 4.85714 12 4.85714C16.6944 4.85714 20.5 8.6947 20.5 13.4286Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const StopwatchSnooze = memo(StopwatchSnoozeInner)
StopwatchSnooze.displayName = 'StopwatchSnooze'