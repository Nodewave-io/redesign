import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Attatchment2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Attatchment2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.4809 6.07196L17.4809 17.2812C17.4809 20.3321 15.3732 22.8 12.2626 22.8C9.21166 22.8 7.19995 20.3918 7.19995 17.2812L7.19995 4.68084C7.19995 2.75238 8.75227 1.20005 10.6807 1.20005C12.6092 1.20005 14.1615 2.75238 14.1615 4.68084L14.1615 17.5025C14.1615 18.4636 13.3823 19.2428 12.4211 19.2428C11.4599 19.2428 10.6807 18.4636 10.6807 17.5025L10.6807 6.07196" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Attatchment2 = memo(Attatchment2Inner)
Attatchment2.displayName = 'Attatchment2'