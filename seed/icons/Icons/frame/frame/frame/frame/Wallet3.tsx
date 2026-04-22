import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Wallet3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Wallet3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.39771 7.54004L2.40239 19.9C2.40239 21.3139 3.54854 22.46 4.96239 22.46H19.0424C20.4562 22.46 21.6024 21.3139 21.6024 19.9V9.66004C21.6024 8.48183 20.6473 7.52671 19.4691 7.52671H2.41653C2.40806 7.52671 2.40051 7.53205 2.39771 7.54004ZM2.39771 7.54004C2.39849 7.30041 16.8024 1.54004 16.8024 1.54004V6.94004M16.4991 14.7633L16.4824 14.78" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Wallet3 = memo(Wallet3Inner)
Wallet3.displayName = 'Wallet3'