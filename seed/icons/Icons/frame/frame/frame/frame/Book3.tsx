import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Book3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Book3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.57133 2.40002V21.6M17.4856 10.6286H12.6856M17.4856 6.51431H12.6856M5.14276 6.51431H2.3999M5.14276 10.6286H2.3999M5.14276 14.7429H2.3999M6.51419 21.6H18.857C20.3719 21.6 21.5999 20.372 21.5999 18.8572V5.14288C21.5999 3.62804 20.3719 2.40002 18.857 2.40002H6.51419C4.99935 2.40002 3.77133 3.62804 3.77133 5.14288V18.8572C3.77133 20.372 4.99935 21.6 6.51419 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Book3 = memo(Book3Inner)
Book3.displayName = 'Book3'