import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Star2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Star2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.4951 2.71393C11.7017 2.29539 12.2985 2.29539 12.5051 2.71393L15.1791 8.13206C15.2611 8.29826 15.4196 8.41346 15.6031 8.44012L21.5823 9.30895C22.0442 9.37607 22.2286 9.94369 21.8944 10.2695L17.5678 14.4869C17.4351 14.6163 17.3745 14.8027 17.4058 14.9854L18.4272 20.9404C18.5061 21.4005 18.0233 21.7513 17.6101 21.5341L12.2621 18.7225C12.0981 18.6362 11.9021 18.6362 11.738 18.7225L6.39002 21.5341C5.97689 21.7513 5.49404 21.4005 5.57294 20.9404L6.59432 14.9854C6.62565 14.8027 6.56509 14.6163 6.43236 14.4869L2.10573 10.2695C1.7715 9.94369 1.95594 9.37607 2.41783 9.30895L8.39708 8.44012C8.5805 8.41346 8.73906 8.29826 8.82109 8.13206L11.4951 2.71393Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Star2 = memo(Star2Inner)
Star2.displayName = 'Star2'