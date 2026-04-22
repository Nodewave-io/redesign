import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const WifiOnInner = forwardRef<SVGSVGElement, IconProps>(
  function WifiOn({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.01129 12.1871C9.31912 8.97669 14.6822 8.97669 17.99 12.1871M9.00596 15.0935C10.6599 13.4883 13.3414 13.4883 14.9953 15.0935M12.0006 18L12.0182 17.983M3 9.61811C7.97056 4.79396 16.0294 4.79396 21 9.61811" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const WifiOn = memo(WifiOnInner)
WifiOn.displayName = 'WifiOn'