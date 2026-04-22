import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const WifiOffInner = forwardRef<SVGSVGElement, IconProps>(
  function WifiOff({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.00596 16.1345C10.6599 14.5519 13.3414 14.5519 14.9953 16.1345M12.0006 19L12.0182 18.9832M6.01129 13.269C7.23355 12.0994 8.73641 11.362 10.3125 11.0568M15.375 11.5636C16.3244 11.9578 17.2138 12.5262 17.99 13.269M12.5625 7.18084C15.6299 7.30988 18.6578 8.49499 21 10.7362M3 10.7362C4.11482 9.66942 5.385 8.84193 6.74084 8.2537M17.0625 18.0141L4.6875 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const WifiOff = memo(WifiOffInner)
WifiOff.displayName = 'WifiOff'