import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const RssInner = forwardRef<SVGSVGElement, IconProps>(
  function Rss({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4 4C12.8366 4 20 11.1634 20 20M4 12C8.41828 12 12 15.5817 12 20M4 20H4.04688" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Rss = memo(RssInner)
Rss.displayName = 'Rss'