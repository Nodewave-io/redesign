import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ClockPlusInner = forwardRef<SVGSVGElement, IconProps>(
  function ClockPlus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.625 14.25L11.25 13.125V8.42087M20.25 12C20.25 7.02944 16.2206 3 11.25 3C6.27944 3 2.25 7.02944 2.25 12C2.25 16.9706 6.27944 21 11.25 21C11.8268 21 12.3909 20.9457 12.9375 20.8421M18.5625 15.375V18.1875M18.5625 18.1875V21M18.5625 18.1875H21.375M18.5625 18.1875H15.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ClockPlus = memo(ClockPlusInner)
ClockPlus.displayName = 'ClockPlus'