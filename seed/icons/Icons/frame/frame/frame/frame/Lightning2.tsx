import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Lightning2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Lightning2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.2799 2.3999L3.67993 13.9199H11.9999L11.3599 21.5999L20.3199 10.0799H11.9999L13.2799 3.0399" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Lightning2 = memo(Lightning2Inner)
Lightning2.displayName = 'Lightning2'