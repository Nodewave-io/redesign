import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Marker3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Marker3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.4004 9.60835C14.4004 10.9338 13.3259 12.0084 12.0004 12.0084C10.6749 12.0084 9.60041 10.9338 9.60041 9.60835C9.60041 8.28287 10.6749 7.20836 12.0004 7.20836C13.3259 7.20836 14.4004 8.28287 14.4004 9.60835Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Marker3 = memo(Marker3Inner)
Marker3.displayName = 'Marker3'