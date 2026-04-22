import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Layers2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Layers2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.3999 12.1744L21.5999 14.3272L11.9999 19.2479L2.3999 14.3272L6.67667 12.135M11.9999 4.75208L21.5999 9.67282L11.9999 14.5936L2.3999 9.67282L11.9999 4.75208Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Layers2 = memo(Layers2Inner)
Layers2.displayName = 'Layers2'