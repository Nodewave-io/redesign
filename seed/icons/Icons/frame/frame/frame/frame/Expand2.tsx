import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Expand2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Expand2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.0004 9.99958L21 3.00003M21 3.00003L15.8572 3M21 3.00003L20.9999 8.14263M10.0004 14L3.00044 21M3.00044 21L8.14326 21M3.00044 21L3.00051 15.8574M14.0004 14L21 20.9996M21 20.9996L21 15.8569M21 20.9996L15.8573 20.9995M10.0004 10.0004L3.00003 3.00003M3.00003 3.00003L3 8.14272M3.00003 3.00003L8.14275 3.0001" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Expand2 = memo(Expand2Inner)
Expand2.displayName = 'Expand2'