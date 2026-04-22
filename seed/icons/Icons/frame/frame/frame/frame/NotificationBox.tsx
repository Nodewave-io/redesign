import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const NotificationBoxInner = forwardRef<SVGSVGElement, IconProps>(
  function NotificationBox({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.875 3H6.375C4.51104 3 3 4.51103 3 6.37498V17.625C3 19.489 4.51104 21 6.375 21H17.625C19.489 21 21 19.489 21 17.625V12.5624M21 5.81248C21 7.36578 19.7408 8.62497 18.1875 8.62497C16.6342 8.62497 15.375 7.36578 15.375 5.81248C15.375 4.25919 16.6342 3 18.1875 3C19.7408 3 21 4.25919 21 5.81248Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const NotificationBox = memo(NotificationBoxInner)
NotificationBox.displayName = 'NotificationBox'