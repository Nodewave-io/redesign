import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UsersProfilesInner = forwardRef<SVGSVGElement, IconProps>(
  function UsersProfiles({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.0253 20.5707L16.0256 17.3569C16.0258 15.5818 14.5867 14.1426 12.8115 14.1426H5.61432C3.83939 14.1426 2.40046 15.5814 2.40026 17.3563L2.3999 20.5707M21.5996 20.5709L21.5999 17.3571C21.6001 15.5819 20.161 14.1428 18.3858 14.1428M15.4062 4.06048C16.1955 4.64612 16.7071 5.58498 16.7071 6.64331C16.7071 7.70164 16.1955 8.64049 15.4062 9.22613M12.4937 6.64313C12.4937 8.41821 11.0547 9.85719 9.27964 9.85719C7.50457 9.85719 6.06559 8.41821 6.06559 6.64313C6.06559 4.86806 7.50457 3.42908 9.27964 3.42908C11.0547 3.42908 12.4937 4.86806 12.4937 6.64313Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const UsersProfiles = memo(UsersProfilesInner)
UsersProfiles.displayName = 'UsersProfiles'