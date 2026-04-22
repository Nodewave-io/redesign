import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Map4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Map4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.625 19.3333V6.28571M14.8125 17.1429V4.02679M3 17.7143V4L8.47826 6.28571L14.7391 4L21 6.28571V20L14.7391 17.7143L8.47826 20L3 17.7143Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Map4 = memo(Map4Inner)
Map4.displayName = 'Map4'