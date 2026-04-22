import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Mail3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Mail3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.125 6.18382L12 12.6949L20.4375 6.18382M9.65589 12L4.125 18.0221M19.875 17.5288L14.3434 12M5.25 19C4.00736 19 3 17.94 3 16.6324V7.36765C3 6.06003 4.00736 5 5.25 5H18.75C19.9926 5 21 6.06003 21 7.36765V16.6324C21 17.94 19.9926 19 18.75 19H5.25Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Mail3 = memo(Mail3Inner)
Mail3.displayName = 'Mail3'