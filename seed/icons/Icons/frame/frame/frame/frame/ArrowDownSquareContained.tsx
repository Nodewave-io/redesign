import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownSquareContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownSquareContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.9776 12.6239L12 16.5M12 16.5L8.02255 12.6239M12 16.5L12 7.9835M6.375 3L17.6251 3C19.4891 3 21.0001 4.51104 21.0001 6.375L21.0001 17.625C21.0001 19.489 19.4891 21 17.6251 21L6.375 21C4.51104 21 3 19.489 3 17.625L3 6.375C3 4.51104 4.51104 3 6.375 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownSquareContained = memo(ArrowDownSquareContainedInner)
ArrowDownSquareContained.displayName = 'ArrowDownSquareContained'