import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyCoinCentInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyCoinCent({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15 8.68889C14.1656 7.93457 13.0804 7.51761 11.9555 7.5191M11.9555 7.5191C11.3574 7.5195 10.7652 7.6377 10.2128 7.86696C9.66036 8.09622 9.1585 8.43204 8.73585 8.85525C8.3132 9.27846 7.97805 9.78078 7.74953 10.3335C7.52101 10.8863 7.4036 11.4786 7.404 12.0767C7.404 14.594 9.44124 16.6343 11.9555 16.6343M11.9555 7.5191L11.9563 5.9999M11.9555 16.6343C13.0789 16.6359 14.1628 16.2201 14.997 15.4676M11.9555 16.6343L11.9563 18.1535M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyCoinCent = memo(CurrencyCoinCentInner)
CurrencyCoinCent.displayName = 'CurrencyCoinCent'