import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const IphoneInner = forwardRef<SVGSVGElement, IconProps>(
  function Iphone({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.40005 3.59992L10 5.99992H14L15.6 3.59992M4.80005 4.7999V19.1999C4.80005 20.5254 5.87457 21.5999 7.20005 21.5999H16.8C18.1255 21.5999 19.2 20.5254 19.2 19.1999V4.79992C19.2 3.47443 18.1255 2.39992 16.8001 2.39992L7.20005 2.3999C5.87457 2.3999 4.80005 3.47442 4.80005 4.7999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Iphone = memo(IphoneInner)
Iphone.displayName = 'Iphone'