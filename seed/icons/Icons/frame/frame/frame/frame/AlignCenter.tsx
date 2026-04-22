import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignCenterInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignCenter({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 19.8H2.3999M19.7999 14.6H5.67577M21.5999 9.39999H2.3999M17.3999 4.79999L7.13783 4.79999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignCenter = memo(AlignCenterInner)
AlignCenter.displayName = 'AlignCenter'