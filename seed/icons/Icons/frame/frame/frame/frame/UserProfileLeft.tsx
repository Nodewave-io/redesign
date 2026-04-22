import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UserProfileLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function UserProfileLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.40039 21.6L2.4008 17.9996C2.40102 16.0116 4.01273 14.4 6.00079 14.4H12.0004M17.5708 18.3L14.9994 15.9M14.9994 15.9L17.5708 13.5M14.9994 15.9H21.5994M14.4004 6.00002C14.4004 7.98825 12.7886 9.60002 10.8004 9.60002C8.81216 9.60002 7.20039 7.98825 7.20039 6.00002C7.20039 4.0118 8.81216 2.40002 10.8004 2.40002C12.7886 2.40002 14.4004 4.0118 14.4004 6.00002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const UserProfileLeft = memo(UserProfileLeftInner)
UserProfileLeft.displayName = 'UserProfileLeft'