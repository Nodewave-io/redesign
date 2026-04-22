import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LaptopInner = forwardRef<SVGSVGElement, IconProps>(
  function Laptop({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.3999 15.6002V6.23096C20.3999 5.1094 19.4597 4.2002 18.2999 4.2002H5.6999C4.5401 4.2002 3.5999 5.1094 3.5999 6.23096V15.6002M20.3999 15.6002C21.0626 15.6002 21.5999 16.1375 21.5999 16.8002V18.6002C21.5999 19.2629 21.0626 19.8002 20.3999 19.8002H3.5999C2.93716 19.8002 2.3999 19.2629 2.3999 18.6002V16.8002C2.3999 16.1375 2.93716 15.6002 3.5999 15.6002M20.3999 15.6002H16.1999L14.3999 16.8002H9.8999L7.7999 15.6002H3.5999" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Laptop = memo(LaptopInner)
Laptop.displayName = 'Laptop'