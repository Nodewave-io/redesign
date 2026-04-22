import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const NotificationBubbleInner = forwardRef<SVGSVGElement, IconProps>(
  function NotificationBubble({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.1048 4.05097C12.7734 4.01733 12.4357 4 12.0931 4C7.62341 4 4 6.94965 4 10.5882C4 14.2268 7.62341 17.1765 12.0931 17.1765C12.7918 17.1765 13.4697 17.1044 14.1164 16.9689L17.1513 20V15.7647C18.5138 14.8434 19.6087 13.459 20 12M20 7.5C20 8.88071 18.8807 10 17.5 10C16.1193 10 15 8.88071 15 7.5C15 6.11929 16.1193 5 17.5 5C18.8807 5 20 6.11929 20 7.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const NotificationBubble = memo(NotificationBubbleInner)
NotificationBubble.displayName = 'NotificationBubble'