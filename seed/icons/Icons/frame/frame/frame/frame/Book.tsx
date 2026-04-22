import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BookInner = forwardRef<SVGSVGElement, IconProps>(
  function Book({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.139 20.487C13.5303 19.4667 17.3703 18.0383 21.5999 20.487V5.18263M2.3999 4.90437V20.487C3.79121 19.4667 7.63121 18.0383 11.8608 20.487V5.46089M2.3999 4.86511C3.79121 3.84482 7.63121 2.41642 11.8608 4.86511M12.139 4.86511C13.5303 3.84482 17.3703 2.41642 21.5999 4.86511" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Book = memo(BookInner)
Book.displayName = 'Book'