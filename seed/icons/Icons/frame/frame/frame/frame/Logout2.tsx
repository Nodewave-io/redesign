import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Logout2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Logout2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.78007 3.6001H5.07419C4.51256 3.6001 3.97392 3.82135 3.57679 4.21517C3.17965 4.609 2.95654 5.14314 2.95654 5.7001V18.3001C2.95654 18.8571 3.17965 19.3912 3.57679 19.785C3.97392 20.1788 4.51256 20.4001 5.07419 20.4001H8.78007M9.04326 12.0001H21.0433M21.0433 12.0001L16.4581 7.2001M21.0433 12.0001L16.4581 16.8001" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Logout2 = memo(Logout2Inner)
Logout2.displayName = 'Logout2'