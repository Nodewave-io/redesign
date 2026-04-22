import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowExpand4Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowExpand4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.2065 4H20M20 4V9.79311M20 4L13.2409 10.7586M9.79349 20H4M4 20V14.2069M4 20L10.7591 13.2414" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowExpand4 = memo(ArrowExpand4Inner)
ArrowExpand4.displayName = 'ArrowExpand4'