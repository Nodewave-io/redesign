import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownLeft2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownLeft2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.5723 16.9492L7.05029 16.9493M7.05029 16.9493L7.05029 8.54851M7.05029 16.9493L16.9498 7.0498" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownLeft2 = memo(ArrowDownLeft2Inner)
ArrowDownLeft2.displayName = 'ArrowDownLeft2'