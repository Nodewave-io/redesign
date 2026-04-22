import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlarmInner = forwardRef<SVGSVGElement, IconProps>(
  function Alarm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 9.31199V12.4499C11.9999 12.6536 12.0808 12.8489 12.2248 12.9929L13.9199 14.688M2.3999 7.00799V6.23999C2.3999 4.11922 4.11913 2.39999 6.2399 2.39999H7.0079M16.9919 2.39999L17.7599 2.39999C19.8807 2.39999 21.5999 4.11922 21.5999 6.23999V7.00799M5.8559 18.912L3.1679 21.6M20.8319 21.6L18.1439 18.912M20.4479 12.768C20.4479 17.4337 16.6656 21.216 11.9999 21.216C7.3342 21.216 3.5519 17.4337 3.5519 12.768C3.5519 8.10229 7.3342 4.31999 11.9999 4.31999C16.6656 4.31999 20.4479 8.10229 20.4479 12.768Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Alarm = memo(AlarmInner)
Alarm.displayName = 'Alarm'