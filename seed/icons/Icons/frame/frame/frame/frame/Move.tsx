import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MoveInner = forwardRef<SVGSVGElement, IconProps>(
  function Move({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.76304 15.3632L2.3999 12M2.3999 12L5.76304 8.63688M2.3999 12H21.5999M18.2368 15.3632L21.5999 12M21.5999 12L18.2368 8.63688M8.63676 5.76317L11.9999 2.40002M11.9999 2.40002L15.363 5.76317M11.9999 2.40002L11.9999 21.6M8.63676 18.2369L11.9999 21.6M11.9999 21.6L15.363 18.2369" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Move = memo(MoveInner)
Move.displayName = 'Move'