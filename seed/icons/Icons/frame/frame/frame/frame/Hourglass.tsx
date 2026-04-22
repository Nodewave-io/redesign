import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HourglassInner = forwardRef<SVGSVGElement, IconProps>(
  function Hourglass({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.27128 21H17.2287C17.7928 21 18.25 20.5395 18.25 19.9714V17.2237C18.25 17.0042 18.1802 16.7904 18.0509 16.6136L15.1058 12.5881C14.8481 12.2359 14.8398 11.7581 15.0851 11.3971L17.8163 7.3769C17.9325 7.20582 17.9947 7.00337 17.9947 6.79608V4.02857C17.9947 3.46051 17.5374 3 16.9734 3H7.27128C6.70724 3 6.25 3.46051 6.25 4.02857V6.77626C6.25 6.99584 6.31977 7.20964 6.44909 7.38641L9.37807 11.3899C9.64353 11.7527 9.64353 12.2473 9.37807 12.6101L6.44909 16.6136C6.31977 16.7904 6.25 17.0042 6.25 17.2237V19.9714C6.25 20.5395 6.70724 21 7.27128 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Hourglass = memo(HourglassInner)
Hourglass.displayName = 'Hourglass'