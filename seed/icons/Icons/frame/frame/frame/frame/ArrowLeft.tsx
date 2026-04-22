import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.6664 19L3.99976 12M3.99976 12L10.6664 5M3.99976 12L19.9998 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowLeft = memo(ArrowLeftInner)
ArrowLeft.displayName = 'ArrowLeft'