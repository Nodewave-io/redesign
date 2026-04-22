import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Hash2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Hash2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20 16H4M20 8H4M6.66667 20L9.33333 4M14.6667 20L17.3333 4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Hash2 = memo(Hash2Inner)
Hash2.displayName = 'Hash2'