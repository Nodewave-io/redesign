import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowLeftSmInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowLeftSm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.1667 16.375L7 12M7 12L11.1667 7.625M7 12H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowLeftSm = memo(ArrowLeftSmInner)
ArrowLeftSm.displayName = 'ArrowLeftSm'