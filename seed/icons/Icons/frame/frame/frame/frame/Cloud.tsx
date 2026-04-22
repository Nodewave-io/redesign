import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CloudInner = forwardRef<SVGSVGElement, IconProps>(
  function Cloud({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.7428 18.8571C18.5303 18.8571 21.5999 15.7868 21.5999 12C21.5999 8.21313 18.5303 5.14282 14.7428 5.14282C11.874 5.14282 9.41508 6.90532 8.39187 9.40644C8.01151 9.30867 7.6124 9.25711 7.1999 9.25711C4.54812 9.25711 2.3999 11.406 2.3999 14.0571C2.3999 16.7082 4.54812 18.8571 7.1999 18.8571H14.7428Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Cloud = memo(CloudInner)
Cloud.displayName = 'Cloud'