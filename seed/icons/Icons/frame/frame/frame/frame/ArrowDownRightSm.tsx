import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownRightSmInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownRightSm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.22353 8L15.9059 8.09412M15.9059 8.09412L16 14.7765M15.9059 8.09412L8 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownRightSm = memo(ArrowDownRightSmInner)
ArrowDownRightSm.displayName = 'ArrowDownRightSm'