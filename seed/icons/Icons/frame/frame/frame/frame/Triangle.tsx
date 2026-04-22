import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TriangleInner = forwardRef<SVGSVGElement, IconProps>(
  function Triangle({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 3.59998L21.5999 20.4H2.3999L11.9999 3.59998Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Triangle = memo(TriangleInner)
Triangle.displayName = 'Triangle'