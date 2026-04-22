import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Server5Inner = forwardRef<SVGSVGElement, IconProps>(
  function Server5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.9999 7.79999C17.9999 11.1137 15.3136 13.8 11.9999 13.8M17.9999 7.79999C17.9999 4.48628 15.3136 1.79999 11.9999 1.79999M17.9999 7.79999H5.9999M11.9999 13.8C8.68619 13.8 5.9999 11.1137 5.9999 7.79999M11.9999 13.8C13.3254 13.8 14.3999 11.1137 14.3999 7.79999C14.3999 4.48628 13.3254 1.79999 11.9999 1.79999M11.9999 13.8C10.6744 13.8 9.5999 11.1137 9.5999 7.79999C9.5999 4.48628 10.6744 1.79999 11.9999 1.79999M5.9999 7.79999C5.9999 4.48628 8.68619 1.79999 11.9999 1.79999M14.3999 19.8C14.3999 21.1255 13.3254 22.2 11.9999 22.2C10.6744 22.2 9.5999 21.1255 9.5999 19.8M14.3999 19.8C14.3999 18.4745 13.3254 17.4 11.9999 17.4C10.6744 17.4 9.5999 18.4745 9.5999 19.8M14.3999 19.8H21.5999M9.5999 19.8H2.3999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Server5 = memo(Server5Inner)
Server5.displayName = 'Server5'