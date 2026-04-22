import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownRight2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownRight2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.8 15.0864L14.4859 20.4004M14.4859 20.4004L9.17193 15.0864M14.4859 20.4004L14.4859 7.60039C14.4859 5.39125 12.6951 3.60039 10.4859 3.60039L4.19995 3.60039" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownRight2 = memo(ArrowDownRight2Inner)
ArrowDownRight2.displayName = 'ArrowDownRight2'