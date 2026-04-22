import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ItalicsInner = forwardRef<SVGSVGElement, IconProps>(
  function Italics({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.5526 19L14.4474 5M10.5526 19H6.5M10.5526 19H14.6052M14.4474 5H10.3948M14.4474 5H18.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Italics = memo(ItalicsInner)
Italics.displayName = 'Italics'