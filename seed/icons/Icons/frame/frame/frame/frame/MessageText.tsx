import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MessageTextInner = forwardRef<SVGSVGElement, IconProps>(
  function MessageText({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.39917 8.39999H15.5992M8.39917 13.2H12.5992M21.5992 12C21.5992 13.38 21.308 14.692 20.7837 15.8779L21.601 21.5991L16.6981 20.3734C15.3091 21.1545 13.7062 21.6 11.9992 21.6C6.69724 21.6 2.39917 17.3019 2.39917 12C2.39917 6.69806 6.69724 2.39999 11.9992 2.39999C17.3011 2.39999 21.5992 6.69806 21.5992 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MessageText = memo(MessageTextInner)
MessageText.displayName = 'MessageText'