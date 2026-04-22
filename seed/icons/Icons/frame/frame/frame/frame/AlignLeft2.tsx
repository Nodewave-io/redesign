import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignLeft2Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignLeft2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.0332 18L7.1999 12M7.1999 12L13.0332 6.00002M7.1999 12H21.5999M2.3999 2.40002V21.6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignLeft2 = memo(AlignLeft2Inner)
AlignLeft2.displayName = 'AlignLeft2'