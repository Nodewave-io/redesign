import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Server2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Server2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 6.6C21.5999 8.58823 17.3018 10.2 11.9999 10.2C6.69797 10.2 2.3999 8.58823 2.3999 6.6M21.5999 6.6C21.5999 4.61177 17.3018 3 11.9999 3C6.69797 3 2.3999 4.61177 2.3999 6.6M21.5999 6.6V17.4C21.5999 19.3882 17.3018 21 11.9999 21C6.69797 21 2.3999 19.3882 2.3999 17.4V6.6M21.5999 12C21.5999 13.9882 17.3018 15.6 11.9999 15.6C6.69797 15.6 2.3999 13.9882 2.3999 12" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Server2 = memo(Server2Inner)
Server2.displayName = 'Server2'