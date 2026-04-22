import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UserProfileCircleInner = forwardRef<SVGSVGElement, IconProps>(
  function UserProfileCircle({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.3999 19.2C5.86107 18.6835 8.02095 16.3067 8.65391 16.3067H15.3463C16.2635 16.3067 18.1359 18.2769 18.5999 18.9714M21.5999 12C21.5999 17.302 17.3018 21.6 11.9999 21.6C6.69797 21.6 2.3999 17.302 2.3999 12C2.3999 6.69809 6.69797 2.40002 11.9999 2.40002C17.3018 2.40002 21.5999 6.69809 21.5999 12ZM15.4387 8.72798C15.4387 6.89647 13.8926 5.40002 12.0002 5.40002C10.1078 5.40002 8.56164 6.89647 8.56164 8.72798C8.56164 10.5595 10.1078 12.0559 12.0002 12.0559C13.8926 12.0559 15.4387 10.5595 15.4387 8.72798Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const UserProfileCircle = memo(UserProfileCircleInner)
UserProfileCircle.displayName = 'UserProfileCircle'