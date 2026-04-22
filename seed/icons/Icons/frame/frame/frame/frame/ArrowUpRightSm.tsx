import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowUpRightSmInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowUpRightSm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.7765 16L8.09412 15.9059M8.09412 15.9059L8 9.22353M8.09412 15.9059L16 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowUpRightSm = memo(ArrowUpRightSmInner)
ArrowUpRightSm.displayName = 'ArrowUpRightSm'