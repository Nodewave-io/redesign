import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HeaderInner = forwardRef<SVGSVGElement, IconProps>(
  function Header({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.63111 20.2155V11.9078M5.63111 20.2155H2.86188M5.63111 20.2155H8.40034M5.63111 11.9078V3.6001M5.63111 11.9078H18.0927M5.63111 3.6001H2.86188M5.63111 3.6001H8.40034M18.0927 11.9078V20.2155M18.0927 11.9078V3.6001M18.0927 20.2155H15.3234M18.0927 20.2155H20.8619M18.0927 3.6001H15.3234M18.0927 3.6001H20.8619" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Header = memo(HeaderInner)
Header.displayName = 'Header'