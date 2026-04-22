import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ListInner = forwardRef<SVGSVGElement, IconProps>(
  function List({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.7201 6H21.6001M8.7201 12.48H21.6001M8.7201 18.96H21.6001M3.6001 6V6.0128M3.6001 12.48V12.4928M3.6001 18.96V18.9728" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const List = memo(ListInner)
List.displayName = 'List'