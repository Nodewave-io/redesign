import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ListNumbersInner = forwardRef<SVGSVGElement, IconProps>(
  function ListNumbers({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.6004 5.99998H21.4004M10.6004 12.5002H21.4004M10.8 19.0002H21.4004M2.5 16C2.5 15.4696 2.71071 14.9609 3.08579 14.5858C3.46086 14.2107 3.96957 14 4.5 14C5.03043 14 5.53914 14.2107 5.91421 14.5858C6.28929 14.9609 6.5 15.4696 6.5 16C6.5 16.591 6 17 5.5 17.5L2.5 20H6.5M4.5 10V4L2.5 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ListNumbers = memo(ListNumbersInner)
ListNumbers.displayName = 'ListNumbers'