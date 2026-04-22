import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MessageSquareTypingInner = forwardRef<SVGSVGElement, IconProps>(
  function MessageSquareTyping({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.1999 9.69023V9.6M11.9999 9.69023V9.6M16.7999 9.69023V9.6M11.6869 16.5913L6.67816 21.6V16.5913H4.7999C3.47442 16.5913 2.3999 15.5168 2.3999 14.1913V4.8C2.3999 3.47452 3.47442 2.4 4.7999 2.4H19.1999C20.5254 2.4 21.5999 3.47452 21.5999 4.8V14.1913C21.5999 15.5168 20.5254 16.5913 19.1999 16.5913H11.6869Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MessageSquareTyping = memo(MessageSquareTypingInner)
MessageSquareTyping.displayName = 'MessageSquareTyping'