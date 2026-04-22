import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CancelRightInner = forwardRef<SVGSVGElement, IconProps>(
  function CancelRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <g opacity="0.9">
        <path d="M8.625 15.375L15.375 8.625M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
    )
  }
)

export const CancelRight = memo(CancelRightInner)
CancelRight.displayName = 'CancelRight'