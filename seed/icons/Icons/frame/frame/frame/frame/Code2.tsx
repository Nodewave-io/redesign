import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Code2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Code2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7999 17.7L13.1999 6.29999M5.9999 15.9L2.3999 12.3L5.9999 8.69999M17.9999 8.69999L21.5999 12.3L17.9999 15.9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Code2 = memo(Code2Inner)
Code2.displayName = 'Code2'