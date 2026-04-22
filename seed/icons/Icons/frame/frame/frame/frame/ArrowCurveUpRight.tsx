import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowCurveUpRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowCurveUpRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.8 8.91411L14.4859 3.6001M14.4859 3.6001L9.17193 8.91411M14.4859 3.6001L14.4859 16.4001C14.4859 18.6092 12.6951 20.4001 10.4859 20.4001L4.19995 20.4001" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowCurveUpRight = memo(ArrowCurveUpRightInner)
ArrowCurveUpRight.displayName = 'ArrowCurveUpRight'