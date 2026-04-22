import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CardCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function CardCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.8002 18.8999H4.20055C2.8751 18.8999 1.80059 17.8254 1.80055 16.5L1.80029 7.50016C1.80026 6.17465 2.87478 5.1001 4.20029 5.1001H18.5997C19.9253 5.1001 20.9998 6.17399 20.9998 7.49951L20.9998 11.7001M17.3998 16.4829L18.9084 17.9915L22.1998 14.6999M2.39983 9.29995H20.3998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CardCheck = memo(CardCheckInner)
CardCheck.displayName = 'CardCheck'