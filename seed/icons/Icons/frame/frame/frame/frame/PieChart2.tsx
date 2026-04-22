import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PieChart2Inner = forwardRef<SVGSVGElement, IconProps>(
  function PieChart2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.4352 21.8824C16.4252 21.8824 20.4705 17.8371 20.4705 12.847H11.4352L11.4352 3.81171C6.44517 3.81168 2.3999 7.85695 2.3999 12.847C2.3999 17.8371 6.44514 21.8824 11.4352 21.8824Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.3881 2.11743V8.80702H21.5999V8.3292C21.5999 4.89853 18.8188 2.11743 15.3881 2.11743Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const PieChart2 = memo(PieChart2Inner)
PieChart2.displayName = 'PieChart2'