import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const KeyboardInner = forwardRef<SVGSVGElement, IconProps>(
  function Keyboard({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.5999 10.2H6.62803M10.1999 10.2H10.228M17.3718 10.2H17.3999M13.7999 10.2H13.828M8.3999 13.8H8.42803M11.9999 13.8H12.028M15.5999 13.8H15.628M4.7999 18H19.1999C20.5254 18 21.5999 16.9255 21.5999 15.6V8.4C21.5999 7.07452 20.5254 6 19.1999 6H4.7999C3.47442 6 2.3999 7.07452 2.3999 8.4V15.6C2.3999 16.9255 3.47442 18 4.7999 18Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Keyboard = memo(KeyboardInner)
Keyboard.displayName = 'Keyboard'