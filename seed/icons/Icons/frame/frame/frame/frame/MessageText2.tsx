import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MessageText2Inner = forwardRef<SVGSVGElement, IconProps>(
  function MessageText2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.1999 7.19999H15.5999M7.1999 12H11.9999M11.6869 16.5913L6.67816 21.6V16.5913H4.7999C3.47442 16.5913 2.3999 15.5168 2.3999 14.1913V4.79999C2.3999 3.47451 3.47442 2.39999 4.7999 2.39999H19.1999C20.5254 2.39999 21.5999 3.47451 21.5999 4.79999V14.1913C21.5999 15.5168 20.5254 16.5913 19.1999 16.5913H11.6869Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MessageText2 = memo(MessageText2Inner)
MessageText2.displayName = 'MessageText2'