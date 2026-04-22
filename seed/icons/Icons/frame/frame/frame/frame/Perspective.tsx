import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PerspectiveInner = forwardRef<SVGSVGElement, IconProps>(
  function Perspective({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 3.60857V20.4006M2.3999 12.0046H21.5999M18.9599 21.6L4.5599 19.8009C3.3599 19.6809 2.3999 18.7214 2.3999 17.522V6.48721C2.3999 5.28778 3.3599 4.32823 4.5599 4.20829L18.9599 2.40914C20.3999 2.2892 21.5999 3.36869 21.5999 4.68806V19.2012C21.5999 20.6405 20.2799 21.72 18.9599 21.4801V21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Perspective = memo(PerspectiveInner)
Perspective.displayName = 'Perspective'