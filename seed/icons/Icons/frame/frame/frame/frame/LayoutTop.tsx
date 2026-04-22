import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LayoutTopInner = forwardRef<SVGSVGElement, IconProps>(
  function LayoutTop({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.9999 9.00002H20.9999M5.9999 21.6H17.9999C19.9881 21.6 21.5999 19.9882 21.5999 18V6.00002C21.5999 4.0118 19.9881 2.40002 17.9999 2.40002H5.9999C4.01168 2.40002 2.3999 4.0118 2.3999 6.00002V18C2.3999 19.9882 4.01168 21.6 5.9999 21.6Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const LayoutTop = memo(LayoutTopInner)
LayoutTop.displayName = 'LayoutTop'