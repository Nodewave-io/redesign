import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Search2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Search2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.927 17.0401L20.4001 20.4001M11.4001 7.2001C13.3883 7.2001 15.0001 8.81187 15.0001 10.8001M19.2801 11.4401C19.2801 15.77 15.77 19.2801 11.4401 19.2801C7.11018 19.2801 3.6001 15.77 3.6001 11.4401C3.6001 7.11018 7.11018 3.6001 11.4401 3.6001C15.77 3.6001 19.2801 7.11018 19.2801 11.4401Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Search2 = memo(Search2Inner)
Search2.displayName = 'Search2'