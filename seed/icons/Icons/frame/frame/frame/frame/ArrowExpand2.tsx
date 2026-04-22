import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowExpand2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowExpand2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.2064 4H19.9995M19.9995 4V9.79311M19.9995 4L14.2064 9.79311M9.79363 20H4.00052M4.00052 20V14.2069M4.00052 20L10.0005 14M20 14.2064V19.9995M20 19.9995H14.2069M20 19.9995L14.2069 14.2064M4 9.79363L4 4.00052M4 4.00052L9.79311 4.00052M4 4.00052L10 10.0005" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowExpand2 = memo(ArrowExpand2Inner)
ArrowExpand2.displayName = 'ArrowExpand2'