import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Bluetooth2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Bluetooth2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6 8.36638L18 16.125L11.6 21V3L18 7.875L6 15.6336" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Bluetooth2 = memo(Bluetooth2Inner)
Bluetooth2.displayName = 'Bluetooth2'