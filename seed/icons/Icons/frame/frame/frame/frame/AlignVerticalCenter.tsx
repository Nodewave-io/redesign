import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignVerticalCenterInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignVerticalCenter({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9996 21.6L11.9996 2.40002M6.39451 9.38184L9.11458 12M9.11458 12L6.39452 14.6182M9.11458 12H2.3999M17.6053 14.6182L14.8852 12M14.8852 12L17.6053 9.38184M14.8852 12L21.5999 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignVerticalCenter = memo(AlignVerticalCenterInner)
AlignVerticalCenter.displayName = 'AlignVerticalCenter'