import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PresentationInner = forwardRef<SVGSVGElement, IconProps>(
  function Presentation({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.1999 11.4V10.2M11.9999 11.4V9M16.7999 11.4V6.6M9.5999 16.2L7.7999 21M16.5935 20.9333L14.4722 16.2664M4.7999 16.2C3.47442 16.2 2.3999 15.1255 2.3999 13.8V5.4C2.3999 4.07452 3.47442 3 4.7999 3H19.1999C20.5254 3 21.5999 4.07452 21.5999 5.4V13.8C21.5999 15.1255 20.5254 16.2 19.1999 16.2H4.7999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Presentation = memo(PresentationInner)
Presentation.displayName = 'Presentation'