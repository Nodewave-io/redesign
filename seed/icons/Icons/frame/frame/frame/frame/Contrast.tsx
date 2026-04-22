import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ContrastInner = forwardRef<SVGSVGElement, IconProps>(
  function Contrast({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 12C2.3999 6.69809 6.69797 2.40002 11.9999 2.40002C17.3018 2.40002 21.5999 6.69809 21.5999 12C21.5999 17.302 17.3018 21.6 11.9999 21.6C6.69797 21.6 2.3999 17.302 2.3999 12Z" stroke={color} strokeWidth="2"/>
        <path d="M17.9999 12.5V11.5C17.9999 8.46246 15.5375 6.00002 12.4999 6.00002C12.2238 6.00002 11.9999 6.22388 11.9999 6.50002V17.5C11.9999 17.7762 12.2238 18 12.4999 18C15.5375 18 17.9999 15.5376 17.9999 12.5Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Contrast = memo(ContrastInner)
Contrast.displayName = 'Contrast'