import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Scissors4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Scissors4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.5799 8.58002L21.5999 19.2M21.5999 4.80003L8.5799 15.42M5.9999 9.60002C4.01168 9.60002 2.3999 7.98825 2.3999 6.00002C2.3999 4.0118 4.01168 2.40003 5.9999 2.40003C7.98813 2.40003 9.5999 4.0118 9.5999 6.00003C9.5999 7.98825 7.98813 9.60002 5.9999 9.60002ZM5.9999 21.6C4.01168 21.6 2.3999 19.9882 2.3999 18C2.3999 16.0118 4.01168 14.4 5.9999 14.4C7.98813 14.4 9.5999 16.0118 9.5999 18C9.5999 19.9882 7.98813 21.6 5.9999 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Scissors4 = memo(Scissors4Inner)
Scissors4.displayName = 'Scissors4'