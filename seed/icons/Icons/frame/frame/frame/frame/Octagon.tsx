import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const OctagonInner = forwardRef<SVGSVGElement, IconProps>(
  function Octagon({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.9438 2.40002L21.5769 8.00058L21.5999 15.9439L15.9994 21.577L8.05598 21.6L2.4229 15.9995L2.3999 8.0561L8.00045 2.42302L15.9438 2.40002Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Octagon = memo(OctagonInner)
Octagon.displayName = 'Octagon'