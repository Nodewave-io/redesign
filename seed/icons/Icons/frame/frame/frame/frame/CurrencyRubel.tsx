import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyRubelInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyRubel({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.5 19V5H14.5C15.2956 5 16.0587 5.31607 16.6213 5.87868C17.1839 6.44129 17.5 7.20435 17.5 8C17.5 8.79565 17.1839 9.55871 16.6213 10.1213C16.0587 10.6839 15.2956 11 14.5 11H6.5M14.5 15H6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyRubel = memo(CurrencyRubelInner)
CurrencyRubel.displayName = 'CurrencyRubel'