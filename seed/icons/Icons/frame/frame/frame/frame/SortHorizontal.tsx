import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SortHorizontalInner = forwardRef<SVGSVGElement, IconProps>(
  function SortHorizontal({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.40005 15.5999L4.80005 11.9999L8.40005 8.3999M15.6 8.3999L19.2 11.9999L15.6 15.5999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SortHorizontal = memo(SortHorizontalInner)
SortHorizontal.displayName = 'SortHorizontal'