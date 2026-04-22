import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Code3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Code3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.1999 16.8L2.3999 12L7.1999 7.20001M16.7999 7.20001L21.5999 12L16.7999 16.8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Code3 = memo(Code3Inner)
Code3.displayName = 'Code3'