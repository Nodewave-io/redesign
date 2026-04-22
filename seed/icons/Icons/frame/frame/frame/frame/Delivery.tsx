import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DeliveryInner = forwardRef<SVGSVGElement, IconProps>(
  function Delivery({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.2069 16.4545C9.2069 17.8604 8.09533 19 6.72414 19C5.35295 19 4.24138 17.8604 4.24138 16.4545M9.2069 16.4545C9.2069 15.0487 8.09533 13.9091 6.72414 13.9091C5.35295 13.9091 4.24138 15.0487 4.24138 16.4545M9.2069 16.4545H14.7931M4.24138 16.4545H3V6C3 5.44771 3.44772 5 4 5H14.7931V16.4545M20.3793 16.4545C20.3793 17.8604 19.2677 19 17.8966 19C16.5254 19 15.4138 17.8604 15.4138 16.4545M20.3793 16.4545C20.3793 15.0487 19.2677 13.9091 17.8966 13.9091C16.5254 13.9091 15.4138 15.0487 15.4138 16.4545M20.3793 16.4545H21V11.3636L17.8966 8.18182H14.7931V16.4545M15.4138 16.4545H14.7931" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Delivery = memo(DeliveryInner)
Delivery.displayName = 'Delivery'