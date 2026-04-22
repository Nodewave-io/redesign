import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ShareInner = forwardRef<SVGSVGElement, IconProps>(
  function Share({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.0002 11.4591L11.4002 5.1001L11.4002 8.7001C3 10.5001 3 18.9001 3 18.9001C3 18.9001 6.6 14.1001 11.4002 14.7001L11.4002 18.4201L21.0002 11.4591Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Share = memo(ShareInner)
Share.displayName = 'Share'