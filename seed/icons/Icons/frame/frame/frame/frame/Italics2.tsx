import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Italics2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Italics2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.3135 16.8L13.0868 7.20002M10.3135 16.8H7.42778M10.3135 16.8H13.1992M13.0868 7.20002H10.2011M13.0868 7.20002H15.9725M4.7999 21.6H19.1999C20.5254 21.6 21.5999 20.5255 21.5999 19.2V4.80002C21.5999 3.47454 20.5254 2.40002 19.1999 2.40002H4.7999C3.47442 2.40002 2.3999 3.47454 2.3999 4.80002V19.2C2.3999 20.5255 3.47442 21.6 4.7999 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Italics2 = memo(Italics2Inner)
Italics2.displayName = 'Italics2'