import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TypeStrikeInner = forwardRef<SVGSVGElement, IconProps>(
  function TypeStrike({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.93558 21.6H11.8703M11.8703 21.6H15.9872M11.8703 21.6V12.3097M4.21945 7.31843V5.4968C4.21945 5.12954 4.37928 4.79961 4.63318 4.57277M11.8703 4.25809H17.7724C18.4565 4.25809 19.0111 4.81268 19.0111 5.4968V7.82849M11.8703 4.25809V6.73551M11.8703 4.25809H9.79365M20.3227 21.6L3.6001 2.40002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TypeStrike = memo(TypeStrikeInner)
TypeStrike.displayName = 'TypeStrike'