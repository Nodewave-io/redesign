import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowDownRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowDownRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.9497 8.42731L16.9498 16.9493M16.9498 16.9493L8.549 16.9493M16.9498 16.9493L7.05029 7.0498" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowDownRight = memo(ArrowDownRightInner)
ArrowDownRight.displayName = 'ArrowDownRight'