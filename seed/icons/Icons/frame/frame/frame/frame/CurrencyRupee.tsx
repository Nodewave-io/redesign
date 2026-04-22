import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyRupeeInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyRupee({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.5 5H6.5H9.5C10.5609 5 11.5783 5.42143 12.3284 6.17157C13.0786 6.92172 13.5 7.93913 13.5 9C13.5 10.0609 13.0786 11.0783 12.3284 11.8284C11.5783 12.5786 10.5609 13 9.5 13H6.5L12.5 19M6.5 9H17.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyRupee = memo(CurrencyRupeeInner)
CurrencyRupee.displayName = 'CurrencyRupee'