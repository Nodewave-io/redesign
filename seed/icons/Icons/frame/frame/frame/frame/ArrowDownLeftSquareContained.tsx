import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownLeftSquareContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownLeftSquareContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.3438 15.3202H8.71875M8.71875 15.3202V9.69514M8.71875 15.3202L14.8125 9.22639M17.625 21L6.37498 21C4.51103 21 3 19.489 3 17.625L3 6.375C3 4.51104 4.51103 3 6.37498 3L17.625 3C19.489 3 21 4.51104 21 6.375V17.625C21 19.489 19.489 21 17.625 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownLeftSquareContained = memo(ArrowDownLeftSquareContainedInner)
ArrowDownLeftSquareContained.displayName = 'ArrowDownLeftSquareContained'