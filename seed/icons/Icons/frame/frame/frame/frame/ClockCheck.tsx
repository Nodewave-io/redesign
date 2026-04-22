import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ClockCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function ClockCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.875 14.25L11.5 13.125V8.42087M20.5 12C20.5 7.02944 16.4706 3 11.5 3C6.52944 3 2.5 7.02944 2.5 12C2.5 16.9706 6.52944 21 11.5 21C12.0768 21 12.6409 20.9457 13.1875 20.8421M15.4375 18.1875L17.125 19.875L21.625 15.375" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ClockCheck = memo(ClockCheckInner)
ClockCheck.displayName = 'ClockCheck'