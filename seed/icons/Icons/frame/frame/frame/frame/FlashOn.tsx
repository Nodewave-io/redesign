import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlashOnInner = forwardRef<SVGSVGElement, IconProps>(
  function FlashOn({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.0968 11.0866L12.0911 21.32C11.7382 21.8286 10.9079 21.6002 10.9079 20.9879L10.8976 15.1343C10.8976 14.4596 10.3268 13.92 9.621 13.9096L5.43836 13.8577C4.9298 13.8473 4.62882 13.318 4.90905 12.9132L11.9147 2.6798C12.2676 2.17124 13.0979 2.39958 13.0979 3.01192L13.1083 8.86554C13.1083 9.54016 13.6791 10.0798 14.3848 10.0902L18.5675 10.1421C19.0656 10.1421 19.3666 10.6818 19.0968 11.0866Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlashOn = memo(FlashOnInner)
FlashOn.displayName = 'FlashOn'