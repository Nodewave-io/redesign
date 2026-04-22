import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TextInput2Inner = forwardRef<SVGSVGElement, IconProps>(
  function TextInput2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.5999 12.6V11.4M21.5999 9.60002V14.4C21.5999 15.0628 21.0626 15.6 20.3999 15.6H3.5999C2.93716 15.6 2.3999 15.0628 2.3999 14.4V9.60002C2.3999 8.93728 2.93716 8.40002 3.5999 8.40002H20.3999C21.0626 8.40002 21.5999 8.93728 21.5999 9.60002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const TextInput2 = memo(TextInput2Inner)
TextInput2.displayName = 'TextInput2'