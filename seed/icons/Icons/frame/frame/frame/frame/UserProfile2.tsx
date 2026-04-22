import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UserProfile2Inner = forwardRef<SVGSVGElement, IconProps>(
  function UserProfile2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 20.5124C2.3999 16.7369 5.55419 13.6762 11.9999 13.6762C18.4456 13.6762 21.5999 16.7369 21.5999 20.5124C21.5999 21.1131 21.1617 21.6 20.6211 21.6H3.37873C2.83814 21.6 2.3999 21.1131 2.3999 20.5124Z" stroke={color} strokeWidth="2"/>
        <path d="M15.5999 6.00002C15.5999 7.98825 13.9881 9.60002 11.9999 9.60002C10.0117 9.60002 8.3999 7.98825 8.3999 6.00002C8.3999 4.0118 10.0117 2.40002 11.9999 2.40002C13.9881 2.40002 15.5999 4.0118 15.5999 6.00002Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const UserProfile2 = memo(UserProfile2Inner)
UserProfile2.displayName = 'UserProfile2'