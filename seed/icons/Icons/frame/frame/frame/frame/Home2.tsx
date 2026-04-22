import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Home2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Home2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.5 17.0625H16.5M11.3046 3.21117L3.50457 8.48603C3.18802 8.7001 3 9.04666 3 9.41605V19.2882C3 20.2336 3.80589 21 4.8 21H19.2C20.1941 21 21 20.2336 21 19.2882V9.41605C21 9.04665 20.812 8.7001 20.4954 8.48603L12.6954 3.21117C12.2791 2.92961 11.7209 2.92961 11.3046 3.21117Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Home2 = memo(Home2Inner)
Home2.displayName = 'Home2'