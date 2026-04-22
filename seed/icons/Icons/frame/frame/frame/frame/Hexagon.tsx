import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HexagonInner = forwardRef<SVGSVGElement, IconProps>(
  function Hexagon({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.0001 2.40002L20.4001 7.20002V16.8L12.0001 21.6L3.6001 16.8V7.20002L12.0001 2.40002Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Hexagon = memo(HexagonInner)
Hexagon.displayName = 'Hexagon'