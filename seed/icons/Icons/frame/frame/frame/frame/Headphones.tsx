import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HeadphonesInner = forwardRef<SVGSVGElement, IconProps>(
  function Headphones({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.6001 15.6001H6.0001C6.66284 15.6001 7.2001 16.1374 7.2001 16.8001V19.2001C7.2001 19.8628 6.66284 20.4001 6.0001 20.4001H3.6001V12.0001C3.6001 7.36091 7.36091 3.6001 12.0001 3.6001C16.6393 3.6001 20.4001 7.36091 20.4001 12.0001V20.4001H18.0001C17.3374 20.4001 16.8001 19.8628 16.8001 19.2001V16.8001C16.8001 16.1374 17.3374 15.6001 18.0001 15.6001H20.4001" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Headphones = memo(HeadphonesInner)
Headphones.displayName = 'Headphones'