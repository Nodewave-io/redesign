import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyPoundInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyPound({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.05 18.4652C16.2655 18.8247 15.4128 19.0108 14.55 19.0108C13.6871 19.0108 12.8344 18.8247 12.05 18.4652C11.2299 18.1821 10.3583 18.0802 9.49509 18.1665C8.63189 18.2528 7.79768 18.5253 7.04995 18.9652C7.58538 18.7798 8.05737 18.4467 8.41132 18.0042C8.76526 17.5618 8.98668 17.0282 9.04995 16.4652V8.96515C9.05523 8.08908 9.34798 7.23897 9.88324 6.54541C10.4185 5.85185 11.1666 5.35319 12.0128 5.12605C12.8589 4.8989 13.7562 4.95582 14.5668 5.28807C15.3775 5.62032 16.0566 6.20951 16.5 6.96515M13.95 12.9652H6.94995" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyPound = memo(CurrencyPoundInner)
CurrencyPound.displayName = 'CurrencyPound'