import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ChevronDoubleLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ChevronDoubleLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.4 5.8L19 11.4L13.4 17M5 5.8L10.6 11.4L5 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ChevronDoubleLeft = memo(ChevronDoubleLeftInner)
ChevronDoubleLeft.displayName = 'ChevronDoubleLeft'