import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyCoinRubelInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyCoinRubel({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.32717 16.7999V7.19991H13.909C14.5166 7.19991 15.0993 7.41664 15.5289 7.80243C15.9585 8.18822 16.1999 8.71146 16.1999 9.25705C16.1999 9.80264 15.9585 10.3259 15.5289 10.7117C15.0993 11.0975 14.5166 11.3142 13.909 11.3142H7.7999M13.909 14.057H7.7999M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyCoinRubel = memo(CurrencyCoinRubelInner)
CurrencyCoinRubel.displayName = 'CurrencyCoinRubel'