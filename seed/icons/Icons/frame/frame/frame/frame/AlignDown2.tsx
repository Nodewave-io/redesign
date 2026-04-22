import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignDown2Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignDown2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.9999 10.9667L11.9999 16.8M11.9999 16.8L5.9999 10.9667M11.9999 16.8L11.9999 2.40002M2.3999 21.6H21.5999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignDown2 = memo(AlignDown2Inner)
AlignDown2.displayName = 'AlignDown2'