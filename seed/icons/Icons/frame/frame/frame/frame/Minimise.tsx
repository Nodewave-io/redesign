import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MinimiseInner = forwardRef<SVGSVGElement, IconProps>(
  function Minimise({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 15.4559H6.2664C7.44456 15.4559 8.39964 16.3728 8.39964 17.5039V21.6M8.3999 2.40002V6.4961C8.3999 7.6272 7.44482 8.54414 6.26666 8.54414H2.40017M21.5999 15.4559H17.7334C16.5552 15.4559 15.6002 16.3728 15.6002 17.5039V21.6M15.5999 2.40002V6.4961C15.5999 7.6272 16.555 8.54414 17.7331 8.54414H21.5996" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Minimise = memo(MinimiseInner)
Minimise.displayName = 'Minimise'