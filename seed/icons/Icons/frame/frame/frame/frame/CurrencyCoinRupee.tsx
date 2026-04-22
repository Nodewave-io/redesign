import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyCoinRupeeInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyCoinRupee({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.5999 7.7999H8.3999H10.3635C11.0579 7.7999 11.7239 8.08888 12.2149 8.60327C12.7059 9.11765 12.9817 9.81531 12.9817 10.5428C12.9817 11.2702 12.7059 11.9679 12.2149 12.4823C11.7239 12.9966 11.0579 13.2856 10.3635 13.2856H8.3999L12.3272 17.3999M8.3999 10.5428H15.5999M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyCoinRupee = memo(CurrencyCoinRupeeInner)
CurrencyCoinRupee.displayName = 'CurrencyCoinRupee'