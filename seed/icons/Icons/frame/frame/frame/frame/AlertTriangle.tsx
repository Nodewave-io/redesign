import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlertTriangleInner = forwardRef<SVGSVGElement, IconProps>(
  function AlertTriangle({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 12.9V8.41447M12 16.2248V16.2642M17.6699 20H6.33007C4.7811 20 3.47392 18.9763 3.06265 17.5757C2.88709 16.9778 3.10281 16.3551 3.43276 15.8249L9.10269 5.60102C10.4311 3.46632 13.5689 3.46633 14.8973 5.60103L20.5672 15.8249C20.8972 16.3551 21.1129 16.9778 20.9373 17.5757C20.5261 18.9763 19.2189 20 17.6699 20Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlertTriangle = memo(AlertTriangleInner)
AlertTriangle.displayName = 'AlertTriangle'