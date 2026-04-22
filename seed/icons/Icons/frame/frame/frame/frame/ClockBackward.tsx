import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ClockBackwardInner = forwardRef<SVGSVGElement, IconProps>(
  function ClockBackward({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.5047 12C19.5047 16.9706 15.4742 21 10.5023 21C5.53048 21 1.5 16.9706 1.5 12C1.5 7.02944 5.53048 3 10.5023 3C13.8345 3 16.7438 4.80989 18.3003 7.5M17.0351 12.9877L19.2857 10.7377L21.5363 12.9877M13.875 14.4541L10.5 13.3291V8.625" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ClockBackward = memo(ClockBackwardInner)
ClockBackward.displayName = 'ClockBackward'