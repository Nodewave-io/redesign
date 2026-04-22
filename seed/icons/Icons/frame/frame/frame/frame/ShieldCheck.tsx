import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ShieldCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function ShieldCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.60005 11.1874L11.4 12.9874L15.0001 9.38738M4.80005 5.78738L10.3901 2.99237C11.4036 2.48562 12.5965 2.48562 13.61 2.99237L19.2001 5.78738C19.2001 5.78738 19.2001 11.0434 19.2001 13.8154C19.2001 16.5874 16.6377 18.4586 12 21.3874C7.36245 18.4586 4.80005 15.9874 4.80005 13.8154V5.78738Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ShieldCheck = memo(ShieldCheckInner)
ShieldCheck.displayName = 'ShieldCheck'