import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UserProfileCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function UserProfileCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 21.6L2.40031 17.9996C2.40053 16.0116 4.01224 14.4 6.00031 14.4H13.1998M16.1999 17.4L17.3999 18.6L21.5999 14.4M14.3999 6.00002C14.3999 7.98825 12.7881 9.60002 10.7999 9.60002C8.81167 9.60002 7.1999 7.98825 7.1999 6.00002C7.1999 4.0118 8.81167 2.40002 10.7999 2.40002C12.7881 2.40002 14.3999 4.0118 14.3999 6.00002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const UserProfileCheck = memo(UserProfileCheckInner)
UserProfileCheck.displayName = 'UserProfileCheck'