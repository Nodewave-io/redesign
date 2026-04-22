import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyCoinYenInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyCoinYen({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 17.2799V12.2399M11.9999 12.2399L8.3999 7.1999M11.9999 12.2399L15.5999 7.1999M9.1199 15.8399H14.8799M9.1199 12.9599H14.8799M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyCoinYen = memo(CurrencyCoinYenInner)
CurrencyCoinYen.displayName = 'CurrencyCoinYen'