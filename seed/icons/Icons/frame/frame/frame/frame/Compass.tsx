import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CompassInner = forwardRef<SVGSVGElement, IconProps>(
  function Compass({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 21.5999C17.3018 21.5999 21.5999 17.3018 21.5999 11.9999C21.5999 6.69797 17.3018 2.3999 11.9999 2.3999C6.69797 2.3999 2.3999 6.69797 2.3999 11.9999C2.3999 17.3018 6.69797 21.5999 11.9999 21.5999Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M15.4975 8.50296L14.649 14.1515L9.00044 15L9.84897 9.35149L15.4975 8.50296Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Compass = memo(CompassInner)
Compass.displayName = 'Compass'