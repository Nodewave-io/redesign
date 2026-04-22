import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Diamond2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Diamond2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 2.40002L21.5999 12L11.9999 21.6L2.3999 12L11.9999 2.40002Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Diamond2 = memo(Diamond2Inner)
Diamond2.displayName = 'Diamond2'