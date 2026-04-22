import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Logout3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Logout3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.35294 16.2001V18.3001C9.35294 18.8571 9.57605 19.3912 9.97319 19.785C10.3703 20.1788 10.909 20.4001 11.4706 20.4001L18.8824 20.4001C19.444 20.4001 19.9826 20.1788 20.3798 19.785C20.7769 19.3912 21 18.8571 21 18.3001L21 5.7001C21 5.14314 20.7769 4.609 20.3798 4.21517C19.9826 3.82135 19.444 3.6001 18.8824 3.6001L11.4706 3.6001C10.909 3.6001 10.3703 3.82135 9.97319 4.21517C9.57605 4.609 9.35294 5.14314 9.35294 5.7001V7.8001M15.7059 12.0001L3 12.0001M3 12.0001L6.17647 15.1501M3 12.0001L6.17647 8.8501" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Logout3 = memo(Logout3Inner)
Logout3.displayName = 'Logout3'