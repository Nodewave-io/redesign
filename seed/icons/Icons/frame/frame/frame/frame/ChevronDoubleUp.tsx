import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ChevronDoubleUpInner = forwardRef<SVGSVGElement, IconProps>(
  function ChevronDoubleUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.8 10.6L11.4 5L17 10.6M5.8 19L11.4 13.4L17 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ChevronDoubleUp = memo(ChevronDoubleUpInner)
ChevronDoubleUp.displayName = 'ChevronDoubleUp'