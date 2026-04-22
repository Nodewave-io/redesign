import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BatteryFill3Inner = forwardRef<SVGSVGElement, IconProps>(
  function BatteryFill3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M22.2001 13.8V10.2M7.80005 9.6V14.4M7.80005 9.6H6.60005M7.80005 9.6H9.00005M7.80005 14.4H6.60005M7.80005 14.4H9.00005M10.2 9.6V14.4M10.2 9.6H9.00005M10.2 9.6H11.4M10.2 14.4H9.00005M10.2 14.4H11.4M12.6 9.6V14.4M12.6 9.6H11.4M12.6 9.6H13.8M12.6 14.4H15V9.6H13.8M12.6 14.4H11.4M6.60005 14.4H5.40005V9.6H6.60005M6.60005 14.4V9.6M9.00005 9.6V14.4M11.4 14.4V9.6M13.8 9.6V14.296M4.20005 18H16.2C17.5255 18 18.6 16.9255 18.6 15.6V8.4C18.6 7.07452 17.5255 6 16.2 6H4.20005C2.87457 6 1.80005 7.07452 1.80005 8.4V15.6C1.80005 16.9255 2.87457 18 4.20005 18Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BatteryFill3 = memo(BatteryFill3Inner)
BatteryFill3.displayName = 'BatteryFill3'