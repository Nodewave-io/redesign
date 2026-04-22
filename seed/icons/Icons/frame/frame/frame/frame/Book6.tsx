import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Book6Inner = forwardRef<SVGSVGElement, IconProps>(
  function Book6({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.4924 15.6923H6.46166C4.83029 15.6923 3.50781 17.0148 3.50781 18.6462M20.4924 15.6923V20.1231C20.4924 20.9388 19.8312 21.6 19.0155 21.6H6.46166C4.83029 21.6 3.50781 20.2775 3.50781 18.6462M20.4924 15.6923V3.87695C20.4924 3.06127 19.8312 2.40002 19.0155 2.40002H8.30781H6.46166C4.83029 2.40002 3.50781 3.72251 3.50781 5.35387V18.6462" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Book6 = memo(Book6Inner)
Book6.displayName = 'Book6'