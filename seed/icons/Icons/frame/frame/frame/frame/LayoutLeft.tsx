import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LayoutLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function LayoutLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.9999 21L8.9999 3.00002M21.5999 18L21.5999 6.00003C21.5999 4.0118 19.9881 2.40003 17.9999 2.40003L5.9999 2.40002C4.01168 2.40002 2.3999 4.0118 2.3999 6.00002L2.3999 18C2.3999 19.9882 4.01167 21.6 5.9999 21.6H17.9999C19.9881 21.6 21.5999 19.9883 21.5999 18Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const LayoutLeft = memo(LayoutLeftInner)
LayoutLeft.displayName = 'LayoutLeft'