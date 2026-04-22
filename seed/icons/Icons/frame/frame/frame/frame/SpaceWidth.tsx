import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SpaceWidthInner = forwardRef<SVGSVGElement, IconProps>(
  function SpaceWidth({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 2.40002V21.6M2.3999 2.40002V21.6M15.5693 9.60002L17.9999 12M17.9999 12L15.5693 14.4M17.9999 12H5.9999M8.43046 14.4L5.9999 12M5.9999 12L8.43046 9.60002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SpaceWidth = memo(SpaceWidthInner)
SpaceWidth.displayName = 'SpaceWidth'