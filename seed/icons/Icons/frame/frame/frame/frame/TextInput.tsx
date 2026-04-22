import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TextInputInner = forwardRef<SVGSVGElement, IconProps>(
  function TextInput({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.80005 4.79999H8.40005" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5999 8.39999H3.5999C2.93716 8.39999 2.3999 8.93725 2.3999 9.59999V14.4C2.3999 15.0627 2.93716 15.6 3.5999 15.6H6.5999M10.7999 8.39999H20.3999C21.0626 8.39999 21.5999 8.93725 21.5999 9.59999V14.4C21.5999 15.0627 21.0626 15.6 20.3999 15.6H10.7999M6.5999 19.2V4.79999M4.7999 19.2H8.3999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TextInput = memo(TextInputInner)
TextInput.displayName = 'TextInput'