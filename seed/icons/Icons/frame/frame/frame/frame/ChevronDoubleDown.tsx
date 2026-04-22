import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ChevronDoubleDownInner = forwardRef<SVGSVGElement, IconProps>(
  function ChevronDoubleDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.2 13.4L11.6 19L6 13.4M17.2 5L11.6 10.6L6 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ChevronDoubleDown = memo(ChevronDoubleDownInner)
ChevronDoubleDown.displayName = 'ChevronDoubleDown'