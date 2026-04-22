import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BatteryEmptyInner = forwardRef<SVGSVGElement, IconProps>(
  function BatteryEmpty({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M22.2 13.8V10.2M4.20005 18H16.2C17.5255 18 18.6 16.9255 18.6 15.6V8.4C18.6 7.07452 17.5255 6 16.2 6H4.20005C2.87457 6 1.80005 7.07452 1.80005 8.4V15.6C1.80005 16.9255 2.87457 18 4.20005 18Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BatteryEmpty = memo(BatteryEmptyInner)
BatteryEmpty.displayName = 'BatteryEmpty'