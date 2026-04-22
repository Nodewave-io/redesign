import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Play3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Play3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.9733 10.9373C19.3397 11.6988 19.3447 12.6568 17.9733 13.5177L7.37627 20.6645C6.04478 21.3751 5.14046 20.9556 5.04553 19.418L5.00057 4.45982C4.97059 3.04355 6.13721 2.6434 7.24887 3.32244L17.9733 10.9373Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Play3 = memo(Play3Inner)
Play3.displayName = 'Play3'