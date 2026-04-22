import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const WatchInner = forwardRef<SVGSVGElement, IconProps>(
  function Watch({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8 16.6709L9.02392 20.6603C9.0753 20.8605 9.25183 21 9.45373 21H14.3409C14.5348 21 14.7064 20.8711 14.7648 20.6815L16 16.6709M16 7.32911L14.9761 3.33972C14.9247 3.13953 14.7482 3 14.5463 3L9.65906 3C9.46516 3 9.29364 3.12889 9.23525 3.31847L8 7.32911M18 11.8861C18 15.2837 15.3137 18.038 12 18.038C8.68629 18.038 6 15.2837 6 11.8861C6 8.48848 8.68629 5.73418 12 5.73418C15.3137 5.73418 18 8.48848 18 11.8861Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Watch = memo(WatchInner)
Watch.displayName = 'Watch'