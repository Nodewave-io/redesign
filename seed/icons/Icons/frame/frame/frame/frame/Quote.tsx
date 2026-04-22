import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const QuoteInner = forwardRef<SVGSVGElement, IconProps>(
  function Quote({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.8511 6C16.4669 6 13.7234 8.74345 13.7234 12.1277C13.7234 13.6269 14.5701 16.5034 16.0213 17.2876M9.12766 6C5.74345 6 3 8.74345 3 12.1277C3 13.6269 3.84672 16.5034 5.29787 17.2876M21 14.8085C21 16.5006 19.6283 17.8723 17.9362 17.8723C16.2441 17.8723 14.8723 16.5006 14.8723 14.8085C14.8723 13.1164 16.2441 11.7447 17.9362 11.7447C19.6283 11.7447 21 13.1164 21 14.8085ZM10.2766 14.8085C10.2766 16.5006 8.90487 17.8723 7.21277 17.8723C5.52066 17.8723 4.14894 16.5006 4.14894 14.8085C4.14894 13.1164 5.52066 11.7447 7.21277 11.7447C8.90487 11.7447 10.2766 13.1164 10.2766 14.8085Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Quote = memo(QuoteInner)
Quote.displayName = 'Quote'