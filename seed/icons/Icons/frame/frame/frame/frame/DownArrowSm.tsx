import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DownArrowSmInner = forwardRef<SVGSVGElement, IconProps>(
  function DownArrowSm({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.375 12.8333L12 17M12 17L7.625 12.8333M12 17L12 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const DownArrowSm = memo(DownArrowSmInner)
DownArrowSm.displayName = 'DownArrowSm'