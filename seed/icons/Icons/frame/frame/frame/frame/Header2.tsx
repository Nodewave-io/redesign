import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Header2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Header2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.26133 16.7998V11.8152M8.26133 16.7998H6.59979M8.26133 16.7998H9.92287M8.26133 11.8152V6.83061M8.26133 11.8152H15.7383M8.26133 6.83061H6.59979M8.26133 6.83061H9.92287M15.7383 11.8152V16.7998M15.7383 11.8152V6.83061M15.7383 16.7998H14.0767M15.7383 16.7998H17.3998M15.7383 6.83061H14.0767M15.7383 6.83061H17.3998M4.7999 21.6H19.1999C20.5254 21.6 21.5999 20.5255 21.5999 19.2V4.80002C21.5999 3.47454 20.5254 2.40002 19.1999 2.40002H4.7999C3.47442 2.40002 2.3999 3.47454 2.3999 4.80002V19.2C2.3999 20.5255 3.47442 21.6 4.7999 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Header2 = memo(Header2Inner)
Header2.displayName = 'Header2'