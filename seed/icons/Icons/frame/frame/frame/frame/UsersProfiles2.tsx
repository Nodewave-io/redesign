import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UsersProfiles2Inner = forwardRef<SVGSVGElement, IconProps>(
  function UsersProfiles2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.1999 13.6857C20.4672 14.6326 21.5999 17.0166 21.5999 18.4856C21.5999 18.9432 21.266 19.3142 20.8541 19.3142H20.3999M15.5999 9.80444C16.4197 9.33018 16.9713 8.44377 16.9713 7.42853C16.9713 6.41328 16.4197 5.52687 15.5999 5.05261M3.14567 19.3142H16.2827C16.6946 19.3142 17.0285 18.9432 17.0285 18.4856C17.0285 15.609 14.6252 13.2771 9.71419 13.2771C4.80317 13.2771 2.3999 15.609 2.3999 18.4856C2.3999 18.9432 2.7338 19.3142 3.14567 19.3142ZM12.457 7.42853C12.457 8.94336 11.229 10.1714 9.71419 10.1714C8.19935 10.1714 6.97133 8.94336 6.97133 7.42853C6.97133 5.91369 8.19935 4.68567 9.71419 4.68567C11.229 4.68567 12.457 5.91369 12.457 7.42853Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const UsersProfiles2 = memo(UsersProfiles2Inner)
UsersProfiles2.displayName = 'UsersProfiles2'