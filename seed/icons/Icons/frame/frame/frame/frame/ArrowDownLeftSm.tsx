import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownLeftSmInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownLeftSm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16 9.22353L15.9059 15.9059M15.9059 15.9059L9.22353 16M15.9059 15.9059L8 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownLeftSm = memo(ArrowDownLeftSmInner)
ArrowDownLeftSm.displayName = 'ArrowDownLeftSm'