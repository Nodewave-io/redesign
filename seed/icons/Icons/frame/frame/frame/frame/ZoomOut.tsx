import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ZoomOutInner = forwardRef<SVGSVGElement, IconProps>(
  function ZoomOut({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.927 17.04L20.4001 20.4M8.4001 11.4H14.4001M19.2801 11.44C19.2801 15.7699 15.77 19.28 11.4401 19.28C7.11019 19.28 3.6001 15.7699 3.6001 11.44C3.6001 7.11006 7.11019 3.59998 11.4401 3.59998C15.77 3.59998 19.2801 7.11006 19.2801 11.44Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const ZoomOut = memo(ZoomOutInner)
ZoomOut.displayName = 'ZoomOut'