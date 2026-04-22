import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRefreshInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRefresh({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.57787 7.25C6.96782 4.70934 9.56573 3 12.5412 3C15.9149 3 18.8031 5.19743 19.9957 8.3125M8.01939 8.3125H4V4.0625M19.4221 15.75C18.0322 18.2907 15.4343 20 12.4588 20C9.08513 20 6.19686 17.8026 5.00433 14.6875M16.9806 14.6875H21V18.9375" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRefresh = memo(ArrowRefreshInner)
ArrowRefresh.displayName = 'ArrowRefresh'