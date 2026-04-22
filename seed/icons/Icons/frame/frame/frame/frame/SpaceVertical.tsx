import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SpaceVerticalInner = forwardRef<SVGSVGElement, IconProps>(
  function SpaceVertical({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 2.40003V21.6M2.3999 2.40002L2.3999 21.6M7.7999 4.80002L7.7999 19.2C7.7999 20.5255 8.87442 21.6 10.1999 21.6H13.7999C15.1254 21.6 16.1999 20.5255 16.1999 19.2L16.1999 4.80002C16.1999 3.47454 15.1254 2.40002 13.7999 2.40002L10.1999 2.40002C8.87442 2.40002 7.7999 3.47454 7.7999 4.80002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SpaceVertical = memo(SpaceVerticalInner)
SpaceVertical.displayName = 'SpaceVertical'