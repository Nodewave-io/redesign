import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Pencil2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Pencil2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 22.2H21.5999M14.9999 4.80002L19.1999 8.40003M4.1999 15.6L16.0313 3.35545C17.3052 2.08155 19.3706 2.08155 20.6445 3.35545C21.9184 4.62935 21.9184 6.69475 20.6445 7.96865L8.3999 19.8L2.3999 21.6L4.1999 15.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Pencil2 = memo(Pencil2Inner)
Pencil2.displayName = 'Pencil2'