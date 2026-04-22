import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UserProfileInner = forwardRef<SVGSVGElement, IconProps>(
  function UserProfile({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.3995 21.6L20.3998 18.0003C20.4 16.012 18.7881 14.4 16.7998 14.4H7.2005C5.21244 14.4 3.60073 16.0116 3.6005 17.9996L3.6001 21.6M15.6001 6.00002C15.6001 7.98825 13.9883 9.60002 12.0001 9.60002C10.0119 9.60002 8.4001 7.98825 8.4001 6.00002C8.4001 4.0118 10.0119 2.40002 12.0001 2.40002C13.9883 2.40002 15.6001 4.0118 15.6001 6.00002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const UserProfile = memo(UserProfileInner)
UserProfile.displayName = 'UserProfile'