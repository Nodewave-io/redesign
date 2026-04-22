import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MediaStripInner = forwardRef<SVGSVGElement, IconProps>(
  function MediaStrip({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.0001 7.1999L21.0001 7.1999M3.0001 16.7999L21.0001 16.7999M12.0001 2.3999L12.0001 21.5999M16.8001 2.3999L16.8001 7.1999M16.8001 16.7999L16.8001 21.5999M7.2001 2.3999L7.2001 7.1999M7.2001 16.7999L7.2001 21.5999M5.99999 2.3999L18.0001 2.3999C19.9883 2.39991 21.6001 4.01168 21.6001 5.99991L21.6001 17.9999C21.6001 19.9881 19.9883 21.5999 18.0001 21.5999L5.99999 21.5999C4.01176 21.5999 2.39999 19.9881 2.39999 17.9999L2.39999 5.9999C2.39999 4.01168 4.01176 2.3999 5.99999 2.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MediaStrip = memo(MediaStripInner)
MediaStrip.displayName = 'MediaStrip'