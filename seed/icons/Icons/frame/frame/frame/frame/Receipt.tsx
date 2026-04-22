import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ReceiptInner = forwardRef<SVGSVGElement, IconProps>(
  function Receipt({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.24 3H5.75995C4.89839 3 4.19995 3.80589 4.19995 4.8V21L6.79995 19.2L9.39995 21L12 19.2L14.6 21L17.2 19.2L19.8 21V4.8C19.8 3.80589 19.1015 3 18.24 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Receipt = memo(ReceiptInner)
Receipt.displayName = 'Receipt'