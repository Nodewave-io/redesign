import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Scissors3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Scissors3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.80015 9.3953L21.6001 16.8001M21.6001 7.20015L4.80015 14.605M6.00015 9.60015C4.01192 9.60015 2.40015 7.98837 2.40015 6.00015C2.40015 4.01192 4.01192 2.40015 6.00015 2.40015C7.98837 2.40015 9.60015 4.01192 9.60015 6.00015C9.60015 7.98837 7.98837 9.60015 6.00015 9.60015ZM6.00015 21.6001C4.01192 21.6001 2.40015 19.9884 2.40015 18.0001C2.40015 16.0119 4.01192 14.4001 6.00015 14.4001C7.98837 14.4001 9.60015 16.0119 9.60015 18.0001C9.60015 19.9884 7.98837 21.6001 6.00015 21.6001Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Scissors3 = memo(Scissors3Inner)
Scissors3.displayName = 'Scissors3'