import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MessageSquareInner = forwardRef<SVGSVGElement, IconProps>(
  function MessageSquare({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.67816 21.6L11.6869 16.5913H19.5999C20.7045 16.5913 21.5999 15.6959 21.5999 14.5913V4.39999C21.5999 3.29542 20.7045 2.39999 19.5999 2.39999H4.3999C3.29533 2.39999 2.3999 3.29542 2.3999 4.39999V14.5913C2.3999 15.6959 3.29533 16.5913 4.3999 16.5913H6.67816V21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MessageSquare = memo(MessageSquareInner)
MessageSquare.displayName = 'MessageSquare'