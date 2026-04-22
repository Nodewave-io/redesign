import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UsersProfilesMinusInner = forwardRef<SVGSVGElement, IconProps>(
  function UsersProfilesMinus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.25 21.6L2.2504 17.9996C2.25063 16.0116 3.86234 14.4 5.8504 14.4H12.45M21.75 15.6H16.35M17.25 2.40002C18.7062 3.2163 19.65 4.5249 19.65 6.00002C19.65 7.47515 18.7062 8.78375 17.25 9.60002M14.25 6.00002C14.25 7.98825 12.6382 9.60002 10.65 9.60002C8.66177 9.60002 7.05 7.98825 7.05 6.00002C7.05 4.0118 8.66177 2.40002 10.65 2.40002C12.6382 2.40002 14.25 4.0118 14.25 6.00002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const UsersProfilesMinus = memo(UsersProfilesMinusInner)
UsersProfilesMinus.displayName = 'UsersProfilesMinus'