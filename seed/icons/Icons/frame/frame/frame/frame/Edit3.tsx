import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Edit3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Edit3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.7999 19.5514H19.7999M4.19995 19.5514L8.56594 18.6717C8.79771 18.625 9.01053 18.5109 9.17767 18.3437L18.9513 8.56461C19.4199 8.09576 19.4196 7.33577 18.9506 6.86731L16.8802 4.79923C16.4114 4.33097 15.6518 4.33129 15.1834 4.79995L5.40871 14.58C5.2419 14.7469 5.128 14.9593 5.08125 15.1906L4.19995 19.5514Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Edit3 = memo(Edit3Inner)
Edit3.displayName = 'Edit3'