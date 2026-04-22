import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SortVertical2Inner = forwardRef<SVGSVGElement, IconProps>(
  function SortVertical2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.4415 6.62732H22M13.4415 11.4421H19.5547M13.4415 16.2569H17.1094M5.80564 6V18M5.80564 18L2 14.3317M5.80564 18L9.7566 14.3317" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SortVertical2 = memo(SortVertical2Inner)
SortVertical2.displayName = 'SortVertical2'