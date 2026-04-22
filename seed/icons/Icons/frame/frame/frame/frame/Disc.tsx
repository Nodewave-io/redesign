import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DiscInner = forwardRef<SVGSVGElement, IconProps>(
  function Disc({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 11.9999C21.5999 17.3018 17.3018 21.5999 11.9999 21.5999C6.69797 21.5999 2.3999 17.3018 2.3999 11.9999C2.3999 6.69797 6.69797 2.3999 11.9999 2.3999C17.3018 2.3999 21.5999 6.69797 21.5999 11.9999Z" stroke={color} strokeWidth="2"/>
        <path d="M14.3999 11.9999C14.3999 13.3254 13.3254 14.3999 11.9999 14.3999C10.6744 14.3999 9.5999 13.3254 9.5999 11.9999C9.5999 10.6744 10.6744 9.5999 11.9999 9.5999C13.3254 9.5999 14.3999 10.6744 14.3999 11.9999Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Disc = memo(DiscInner)
Disc.displayName = 'Disc'