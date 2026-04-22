import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowLeftSquareContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowLeftSquareContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.376 15.9775L7.49997 12M7.49997 12L11.376 8.02252M7.49997 12H16.0164M20.9999 6.37498L20.9999 17.625C20.9999 19.489 19.4889 21 17.6249 21H6.37498C4.51103 21 3 19.489 3 17.625V6.37498C3 4.51103 4.51103 3 6.37498 3H17.6249C19.4889 3 20.9999 4.51103 20.9999 6.37498Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowLeftSquareContained = memo(ArrowLeftSquareContainedInner)
ArrowLeftSquareContained.displayName = 'ArrowLeftSquareContained'