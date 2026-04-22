import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Layers3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Layers3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.3999 9.82233L21.5999 11.9752L11.9999 16.8959L2.3999 11.9752L6.67667 9.78298M17.3999 14.5265L21.5999 16.6793L11.9999 21.6L2.3999 16.6793L6.67667 14.4871M11.9999 2.40002L21.5999 7.32077L11.9999 12.2415L2.3999 7.32077L11.9999 2.40002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Layers3 = memo(Layers3Inner)
Layers3.displayName = 'Layers3'