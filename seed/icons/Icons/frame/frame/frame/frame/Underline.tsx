import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UnderlineInner = forwardRef<SVGSVGElement, IconProps>(
  function Underline({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20 20H4M17.7143 5.14286V10.8571C17.7143 14.0131 15.1559 16.5714 12 16.5714C8.84409 16.5714 6.28571 14.0131 6.28571 10.8571V5.14286M4.57143 4H8M16 4L19.4286 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Underline = memo(UnderlineInner)
Underline.displayName = 'Underline'