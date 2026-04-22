import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRightSmInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRightSm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.8333 7.625L17 12M17 12L12.8333 16.375M17 12L7 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRightSm = memo(ArrowRightSmInner)
ArrowRightSm.displayName = 'ArrowRightSm'