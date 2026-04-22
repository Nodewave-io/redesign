import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SpaceHeightInner = forwardRef<SVGSVGElement, IconProps>(
  function SpaceHeight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 21.6H2.3999M21.5999 2.40003L2.3999 2.40002M14.3999 15.5695L11.9999 18M11.9999 18L9.5999 15.5695M11.9999 18L11.9999 6.00003M9.5999 8.43058L11.9999 6.00003M11.9999 6.00003L14.3999 8.43058" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SpaceHeight = memo(SpaceHeightInner)
SpaceHeight.displayName = 'SpaceHeight'