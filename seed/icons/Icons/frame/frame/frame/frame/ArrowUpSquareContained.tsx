import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowUpSquareContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowUpSquareContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.02255 11.3761L12.0001 7.5M12.0001 7.5L15.9776 11.3761M12.0001 7.5V16.0165M17.6251 21L6.375 21C4.51104 21 3 19.489 3 17.625L3 6.375C3 4.51104 4.51104 3 6.375 3L17.6251 3C19.4891 3 21.0001 4.51104 21.0001 6.375V17.625C21.0001 19.489 19.4891 21 17.6251 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowUpSquareContained = memo(ArrowUpSquareContainedInner)
ArrowUpSquareContained.displayName = 'ArrowUpSquareContained'