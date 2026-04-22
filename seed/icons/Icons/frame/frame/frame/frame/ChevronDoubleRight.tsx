import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ChevronDoubleRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ChevronDoubleRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.6 17.2L5 11.6L10.6 6M19 17.2L13.4 11.6L19 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ChevronDoubleRight = memo(ChevronDoubleRightInner)
ChevronDoubleRight.displayName = 'ChevronDoubleRight'