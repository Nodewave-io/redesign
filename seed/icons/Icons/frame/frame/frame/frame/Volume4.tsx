import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Volume4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Volume4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21 11.9174H15.9375M18.4688 14.3843V9.45019M12.0161 6L7.64072 9.48865H3V14.5114L7.64072 14.5101L12.0161 18V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Volume4 = memo(Volume4Inner)
Volume4.displayName = 'Volume4'