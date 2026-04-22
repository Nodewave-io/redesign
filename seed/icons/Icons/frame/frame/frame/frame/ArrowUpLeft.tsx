import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowUpLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowUpLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.05041 15.5718L7.05029 7.04981M7.05029 7.04981L15.4511 7.0498M7.05029 7.04981L16.9498 16.9493" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowUpLeft = memo(ArrowUpLeftInner)
ArrowUpLeft.displayName = 'ArrowUpLeft'