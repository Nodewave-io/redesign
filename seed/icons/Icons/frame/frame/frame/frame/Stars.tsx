import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const StarsInner = forwardRef<SVGSVGElement, IconProps>(
  function Stars({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.8234 2.3999L16.6537 7.34611L21.5999 9.17637L16.6537 11.0066L14.8234 15.9528L12.9932 11.0066L8.04696 9.17637L12.9932 7.34611L14.8234 2.3999Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M6.35284 13.694L7.95167 16.0481L10.3058 17.647L7.95167 19.2458L6.35284 21.5999L4.75402 19.2458L2.3999 17.647L4.75402 16.0481L6.35284 13.694Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Stars = memo(StarsInner)
Stars.displayName = 'Stars'