import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MessageSquareInformationInner = forwardRef<SVGSVGElement, IconProps>(
  function MessageSquareInformation({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.001 13.2002V9.60021M12.001 6.00021V6.09044M11.6869 16.5913L6.67816 21.6V16.5913H4.7999C3.47442 16.5913 2.3999 15.5168 2.3999 14.1913V4.8C2.3999 3.47452 3.47442 2.4 4.7999 2.4H19.1999C20.5254 2.4 21.5999 3.47452 21.5999 4.8V14.1913C21.5999 15.5168 20.5254 16.5913 19.1999 16.5913H11.6869Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MessageSquareInformation = memo(MessageSquareInformationInner)
MessageSquareInformation.displayName = 'MessageSquareInformation'