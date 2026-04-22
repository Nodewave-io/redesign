import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BatteryFillInner = forwardRef<SVGSVGElement, IconProps>(
  function BatteryFill({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M22.2001 13.8V10.2M6.60005 9.6H5.40005V14.4H6.60005M6.60005 9.6H7.80005V14.4H6.60005M6.60005 9.6V14.4M4.20005 18H16.2C17.5255 18 18.6 16.9255 18.6 15.6V8.4C18.6 7.07452 17.5255 6 16.2 6H4.20005C2.87457 6 1.80005 7.07452 1.80005 8.4V15.6C1.80005 16.9255 2.87457 18 4.20005 18Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BatteryFill = memo(BatteryFillInner)
BatteryFill.displayName = 'BatteryFill'