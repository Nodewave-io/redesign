import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const IconInner = forwardRef<SVGSVGElement, IconProps>(
  function Icon({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7997 21.5998H6.5997C5.27421 21.5998 4.1997 20.5253 4.19971 19.1998L4.1998 4.79989C4.19981 3.47441 5.27432 2.3999 6.5998 2.3999H17.4001C18.7256 2.3999 19.8001 3.47442 19.8001 4.7999V12.5999M19.8001 21.5999L17.4001 19.1999M17.4001 19.1999L15.0001 16.7999M17.4001 19.1999L15.0001 21.5999M17.4001 19.1999L19.8001 16.7999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Icon = memo(IconInner)
Icon.displayName = 'Icon'