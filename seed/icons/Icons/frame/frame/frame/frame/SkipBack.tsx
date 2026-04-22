import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SkipBackInner = forwardRef<SVGSVGElement, IconProps>(
  function SkipBack({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5 20.1483L5 3.85174M17.5639 20.7493L9.50015 12.6011C9.17163 12.2691 9.17163 11.7309 9.50015 11.3989L17.5639 3.25067C18.0939 2.71518 19 3.09444 19 3.85174L19 20.1483C19 20.9056 18.0939 21.2848 17.5639 20.7493Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SkipBack = memo(SkipBackInner)
SkipBack.displayName = 'SkipBack'