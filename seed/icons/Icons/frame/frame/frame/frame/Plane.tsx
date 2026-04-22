import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PlaneInner = forwardRef<SVGSVGElement, IconProps>(
  function Plane({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.87725 15.3975L6.6941 17.3059L8.60252 21.1228L10.5109 19.2144V16.3517L13.8507 13.012L16.7133 21.5999L19.576 18.7373L17.1904 9.67225L21.0073 5.85541C21.7978 5.06491 21.7978 3.78327 21.0073 2.99277C20.2168 2.20228 18.9351 2.20228 18.1446 2.99277L14.3278 6.80962L5.26278 4.42409L2.40015 7.28673L10.9881 10.1494L7.64831 13.4891H4.78568L2.87725 15.3975Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Plane = memo(PlaneInner)
Plane.displayName = 'Plane'