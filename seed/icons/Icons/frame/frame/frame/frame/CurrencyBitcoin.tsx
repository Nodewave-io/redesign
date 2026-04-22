import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyBitcoinInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyBitcoin({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.5 6H14.5C15.2956 6 16.0587 6.31607 16.6213 6.87868C17.1839 7.44129 17.5 8.20435 17.5 9C17.5 9.79565 17.1839 10.5587 16.6213 11.1213C16.0587 11.6839 15.2956 12 14.5 12M14.5 12C15.2956 12 16.0587 12.3161 16.6213 12.8787C17.1839 13.4413 17.5 14.2044 17.5 15C17.5 15.7956 17.1839 16.5587 16.6213 17.1213C16.0587 17.6839 15.2956 18 14.5 18H6.5M14.5 12H8.5M8.5 6V18M9.5 3V6M13.5 3V6M9.5 18V21M13.5 18V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyBitcoin = memo(CurrencyBitcoinInner)
CurrencyBitcoin.displayName = 'CurrencyBitcoin'