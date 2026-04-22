import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Image2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Image2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.1599 15.6002L11.9999 12.0002L14.5599 13.8002L18.1866 10.2002L21.3866 13.2002M2.3999 9.0002V19.8002H15.1999M10.0799 7.8002V7.70996M21.5999 15.2002V5.2002C21.5999 4.64791 21.1522 4.2002 20.5999 4.2002H7.2399C6.68762 4.2002 6.2399 4.64791 6.2399 5.2002V15.2002C6.2399 15.7525 6.68762 16.2002 7.2399 16.2002H20.5999C21.1522 16.2002 21.5999 15.7525 21.5999 15.2002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Image2 = memo(Image2Inner)
Image2.displayName = 'Image2'