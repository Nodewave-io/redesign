import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CircleInner = forwardRef<SVGSVGElement, IconProps>(
  function Circle({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 12C21.5999 17.302 17.3018 21.6 11.9999 21.6C6.69797 21.6 2.3999 17.302 2.3999 12C2.3999 6.69809 6.69797 2.40002 11.9999 2.40002C17.3018 2.40002 21.5999 6.69809 21.5999 12Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Circle = memo(CircleInner)
Circle.displayName = 'Circle'