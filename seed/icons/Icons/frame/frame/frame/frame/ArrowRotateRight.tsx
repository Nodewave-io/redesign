import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRotateRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRotateRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.1288 14.5C18.1109 17.6939 15.1954 20 11.7576 20C7.47318 20 4 16.4183 4 12C4 7.58172 7.47318 4 11.7576 4C14.629 4 17.136 5.60879 18.4773 8M16.1212 9H20V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRotateRight = memo(ArrowRotateRightInner)
ArrowRotateRight.displayName = 'ArrowRotateRight'