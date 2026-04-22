import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRightSquareContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRightSquareContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.6239 8.02252L16.4999 12M16.4999 12L12.6239 15.9775M16.4999 12H7.98347M3 17.625L3 6.37498C3 4.51103 4.51103 3 6.37498 3L17.6249 3C19.4889 3 20.9999 4.51103 20.9999 6.37498V17.625C20.9999 19.489 19.4889 21 17.6249 21H6.37498C4.51103 21 3 19.489 3 17.625Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRightSquareContained = memo(ArrowRightSquareContainedInner)
ArrowRightSquareContained.displayName = 'ArrowRightSquareContained'