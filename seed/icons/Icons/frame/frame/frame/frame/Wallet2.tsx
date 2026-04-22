import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Wallet2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Wallet2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.7599 3.04004H3.89323C3.06849 3.04004 2.40168 3.92668 2.40091 4.84004C2.3999 6.04004 3.06849 7.22671 3.89324 7.22671H19.4666C20.6448 7.22671 21.5999 6.98183 21.5999 8.16004V18.4C21.5999 19.8139 20.4538 20.96 19.0399 20.96H4.9599C3.54605 20.96 2.3999 19.8139 2.3999 18.4V5.44004M16.4966 13.2633L16.4799 13.28" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Wallet2 = memo(Wallet2Inner)
Wallet2.displayName = 'Wallet2'