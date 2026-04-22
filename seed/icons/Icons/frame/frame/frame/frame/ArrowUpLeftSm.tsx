import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowUpLeftSmInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowUpLeftSm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8 14.7765L8.09412 8.09412M8.09412 8.09412L14.7765 8M8.09412 8.09412L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowUpLeftSm = memo(ArrowUpLeftSmInner)
ArrowUpLeftSm.displayName = 'ArrowUpLeftSm'