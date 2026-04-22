import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Luggage4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Luggage4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.4375 7.63242V5.35892C8.4375 4.73111 8.96916 4.22217 9.625 4.22217H13.7812C14.4371 4.22217 14.9688 4.73111 14.9688 5.35892V7.63242M4.875 18.9999H19.125C20.4367 18.9999 21.5 17.9821 21.5 16.7264V9.90593C21.5 8.65031 20.4367 7.63242 19.125 7.63242H4.875C3.56332 7.63242 2.5 8.65031 2.5 9.90593V16.7264C2.5 17.9821 3.56332 18.9999 4.875 18.9999Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Luggage4 = memo(Luggage4Inner)
Luggage4.displayName = 'Luggage4'