import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GearInner = forwardRef<SVGSVGElement, IconProps>(
  function Gear({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M21 7L12 2L3 7V17L12 22L21 17V7ZM12 15.3333C13.9132 15.3333 15.4641 13.841 15.4641 12C15.4641 10.1591 13.9132 8.66667 12 8.66667C10.0868 8.66667 8.5359 10.1591 8.5359 12C8.5359 13.841 10.0868 15.3333 12 15.3333Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Gear = memo(GearInner)
Gear.displayName = 'Gear'