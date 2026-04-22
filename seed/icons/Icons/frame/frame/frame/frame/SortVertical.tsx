import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SortVerticalInner = forwardRef<SVGSVGElement, IconProps>(
  function SortVertical({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.5999 15.5998L11.9999 19.1998L8.3999 15.5998M8.3999 8.3998L11.9999 4.7998L15.5999 8.3998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SortVertical = memo(SortVerticalInner)
SortVertical.displayName = 'SortVertical'