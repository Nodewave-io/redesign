import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlipInner = forwardRef<SVGSVGElement, IconProps>(
  function Flip({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 19.2V16.8M11.9999 12.6V10.2M11.9999 5.99998V3.59998M2.40061 15.6L2.3999 7.19998L8.3999 11.4L2.40061 15.6ZM21.5992 7.19998L21.5999 15.6L15.5999 11.4L21.5992 7.19998Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Flip = memo(FlipInner)
Flip.displayName = 'Flip'