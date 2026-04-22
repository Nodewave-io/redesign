import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HomeInner = forwardRef<SVGSVGElement, IconProps>(
  function Home({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 9.41605C3 9.04666 3.18802 8.7001 3.50457 8.48603L11.3046 3.21117C11.7209 2.92961 12.2791 2.92961 12.6954 3.21117L20.4954 8.48603C20.812 8.7001 21 9.04665 21 9.41605V19.2882C21 20.2336 20.1941 21 19.2 21H4.8C3.80589 21 3 20.2336 3 19.2882V9.41605Z" stroke={color} strokeWidth="2"/>
        <path d="M14.25 13.125C14.25 14.3676 13.2426 15.375 12 15.375C10.7574 15.375 9.75 14.3676 9.75 13.125C9.75 11.8824 10.7574 10.875 12 10.875C13.2426 10.875 14.25 11.8824 14.25 13.125Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Home = memo(HomeInner)
Home.displayName = 'Home'