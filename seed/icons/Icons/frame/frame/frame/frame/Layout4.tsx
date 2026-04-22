import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Layout4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Layout4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.9999 7.80002H20.9999M17.9999 12H5.9999M13.1999 16.8H5.9999M5.9999 21.6H17.9999C19.9881 21.6 21.5999 19.9882 21.5999 18V6.00002C21.5999 4.0118 19.9881 2.40002 17.9999 2.40002H5.9999C4.01168 2.40002 2.3999 4.0118 2.3999 6.00002V18C2.3999 19.9882 4.01168 21.6 5.9999 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Layout4 = memo(Layout4Inner)
Layout4.displayName = 'Layout4'