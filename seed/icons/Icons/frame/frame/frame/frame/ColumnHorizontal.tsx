import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ColumnHorizontalInner = forwardRef<SVGSVGElement, IconProps>(
  function ColumnHorizontal({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21 19C21 20.1046 20.1168 21 19.0274 21L4.9726 21C3.88316 21 3 20.1046 3 19L3 16C3 14.8954 3.88316 14 4.9726 14L19.0274 14C20.1168 14 21 14.8954 21 16V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 5C21 3.89543 20.1168 3 19.0274 3L4.9726 3C3.88316 3 3 3.89543 3 5L3 8C3 9.10457 3.88316 10 4.9726 10H19.0274C20.1168 10 21 9.10457 21 8V5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ColumnHorizontal = memo(ColumnHorizontalInner)
ColumnHorizontal.displayName = 'ColumnHorizontal'