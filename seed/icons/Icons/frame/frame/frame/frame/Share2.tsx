import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Share2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Share2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.6001 15.2197V18.9256C3.6001 19.4873 3.82135 20.0259 4.21517 20.423C4.609 20.8202 5.14314 21.0433 5.7001 21.0433H18.3001C18.8571 21.0433 19.3912 20.8202 19.785 20.423C20.1788 20.0259 20.4001 19.4872 20.4001 18.9256V15.2197M12.0435 14.9565L12.0435 2.95654M12.0435 2.95654L7.24346 7.54169M12.0435 2.95654L16.8434 7.54169" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Share2 = memo(Share2Inner)
Share2.displayName = 'Share2'