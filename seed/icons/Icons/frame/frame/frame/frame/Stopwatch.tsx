import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const StopwatchInner = forwardRef<SVGSVGElement, IconProps>(
  function Stopwatch({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.8344 4.07792L20.0032 5.24675M21.1721 6.41558L20.0032 5.24675M9.22403 2H14.1591M18.0552 7.19481L20.0032 5.24675M12.7711 10.961L11.0909 12.6412L12.7711 14.3214L11.0909 16.0016M20.3929 13.4286C20.3929 18.1624 16.5553 22 11.8214 22C7.08756 22 3.25 18.1624 3.25 13.4286C3.25 8.6947 7.08756 4.85714 11.8214 4.85714C16.5553 4.85714 20.3929 8.6947 20.3929 13.4286Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Stopwatch = memo(StopwatchInner)
Stopwatch.displayName = 'Stopwatch'