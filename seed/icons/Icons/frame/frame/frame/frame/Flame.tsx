import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlameInner = forwardRef<SVGSVGElement, IconProps>(
  function Flame({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.0001 21.5999C8.03005 21.5999 4.80005 18.5578 4.80005 14.8186C4.80005 9.5999 12.0002 2.3999 12.0002 2.3999C12.0002 2.3999 19.2 9.5999 19.2 14.8186C19.2 18.5579 15.9702 21.5999 12.0001 21.5999ZM12.0001 21.5999C10.0151 21.5999 8.40005 20.0789 8.40005 18.2093C8.40005 15.5999 12.0001 11.9999 12.0001 11.9999C12.0001 11.9999 15.6 15.5999 15.6 18.2093C15.6 20.0789 13.9851 21.5999 12.0001 21.5999Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Flame = memo(FlameInner)
Flame.displayName = 'Flame'