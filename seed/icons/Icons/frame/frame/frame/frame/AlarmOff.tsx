import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlarmOffInner = forwardRef<SVGSVGElement, IconProps>(
  function AlarmOff({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 7.00799V6.23999C2.3999 5.37536 2.68567 4.57747 3.1679 3.93562M16.9919 2.39999L17.7599 2.39999C19.8807 2.39999 21.5999 4.11922 21.5999 6.23999V7.00799M5.8559 18.912L3.1679 21.6M20.8319 21.6L3.5519 3.49768M9.5999 4.66577C10.3607 4.44076 11.1662 4.31999 11.9999 4.31999C16.6656 4.31999 20.4479 8.10229 20.4479 12.768C20.4479 14.1049 20.1373 15.3694 19.5844 16.493M17.7599 18.9479C16.2509 20.355 14.2259 21.216 11.9999 21.216C7.3342 21.216 3.5519 17.4337 3.5519 12.768C3.5519 10.542 4.41287 8.51702 5.81996 7.00799" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlarmOff = memo(AlarmOffInner)
AlarmOff.displayName = 'AlarmOff'