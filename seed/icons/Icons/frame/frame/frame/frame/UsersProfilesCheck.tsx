import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UsersProfilesCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function UsersProfilesCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 21.5999L2.40031 17.9995C2.40053 16.0114 4.01224 14.3999 6.00031 14.3999H13.1998M16.1999 17.3999L17.3999 18.5999L21.5999 14.3999M17.3999 2.3999C18.8561 3.21618 19.7999 4.52478 19.7999 5.9999C19.7999 7.47502 18.8561 8.78362 17.3999 9.5999M14.3999 5.9999C14.3999 7.98813 12.7881 9.5999 10.7999 9.5999C8.81167 9.5999 7.1999 7.98813 7.1999 5.9999C7.1999 4.01168 8.81167 2.3999 10.7999 2.3999C12.7881 2.3999 14.3999 4.01168 14.3999 5.9999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const UsersProfilesCheck = memo(UsersProfilesCheckInner)
UsersProfilesCheck.displayName = 'UsersProfilesCheck'