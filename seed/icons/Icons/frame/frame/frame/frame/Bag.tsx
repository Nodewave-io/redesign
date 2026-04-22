import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BagInner = forwardRef<SVGSVGElement, IconProps>(
  function Bag({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.3999 9.62394L10.2307 4.35394C11.1819 3.31626 12.8179 3.31626 13.7691 4.35394L18.5999 9.62394M21.1974 10.9209L18.4654 19.7209C18.3355 20.1393 17.9484 20.4244 17.5103 20.4244H6.55548C6.1196 20.4244 5.73394 20.1421 5.60223 19.7266L2.81268 10.9266C2.60831 10.2819 3.08958 9.62442 3.76594 9.62442H20.2424C20.9162 9.62442 21.3972 10.2774 21.1974 10.9209Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Bag = memo(BagInner)
Bag.displayName = 'Bag'