import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Image3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Image3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.7999 21.5999H19.1999C20.5254 21.5999 21.5999 20.4688 21.5999 19.0736V4.92622C21.5999 3.53097 20.5254 2.3999 19.1999 2.3999H4.7999C3.47442 2.3999 2.3999 3.53097 2.3999 4.92622V19.0736C2.3999 20.4688 3.47442 21.5999 4.7999 21.5999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.99991 15.5998H17.9999L13.9999 8.59979L10.9999 13.0998L8.99991 11.0998L5.99991 15.5998Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Image3 = memo(Image3Inner)
Image3.displayName = 'Image3'