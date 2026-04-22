import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CardNumberInner = forwardRef<SVGSVGElement, IconProps>(
  function CardNumber({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.4001 18.2998H4.8004C3.47495 18.2998 2.40044 17.2253 2.4004 15.8999L2.40015 6.90007C2.40011 5.57456 3.47464 4.5 4.80015 4.5H19.1996C20.5251 4.5 21.5996 5.5739 21.5996 6.89942L21.5997 11.1M2.99968 8.69985H20.9997M18.6007 19.4996H20.1246M20.1246 19.4996H21.5428M20.1246 19.4996V13.9359L18.3791 15.1359" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CardNumber = memo(CardNumberInner)
CardNumber.displayName = 'CardNumber'