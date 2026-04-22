import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Book4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Book4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.4924 15.6923H6.46166C4.83029 15.6923 3.50781 17.0148 3.50781 18.6462M20.4924 15.6923V20.1231C20.4924 20.9388 19.8312 21.6 19.0155 21.6H6.46166C4.83029 21.6 3.50781 20.2775 3.50781 18.6462M20.4924 15.6923V3.87695C20.4924 3.06127 19.8312 2.40002 19.0155 2.40002H8.30781M3.50781 18.6462V5.35387C3.50781 3.72251 4.83029 2.40002 6.46166 2.40002H8.30781M12.0575 6.83079H16.1078M12.0575 11.2616H16.1078M8.30781 15.6V2.40002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Book4 = memo(Book4Inner)
Book4.displayName = 'Book4'