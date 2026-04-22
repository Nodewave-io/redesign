import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Volume2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Volume2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21 9.72431L18.75 11.9173M18.75 11.9173L16.5 14.1102M18.75 11.9173L21 14.1102M18.75 11.9173L16.5 9.72431M12.0161 6L7.64072 9.48865H3V14.5114L7.64072 14.5101L12.0161 18V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Volume2 = memo(Volume2Inner)
Volume2.displayName = 'Volume2'