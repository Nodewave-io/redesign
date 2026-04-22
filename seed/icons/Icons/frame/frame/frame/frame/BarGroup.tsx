import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BarGroupInner = forwardRef<SVGSVGElement, IconProps>(
  function BarGroup({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.05647 21V11.024C9.05647 10.4717 9.50419 10.024 10.0565 10.024H14.1147C14.667 10.024 15.1147 10.4717 15.1147 11.024V21M9.05647 21L9.05792 16.6803C9.0581 16.1279 8.61033 15.68 8.05791 15.68H4C3.44772 15.68 3 16.1277 3 16.68V20C3 20.5523 3.44772 21 4 21H9.05647ZM9.05647 21H15.1147M15.1147 21V4C15.1147 3.44772 15.5624 3 16.1147 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15.1147Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BarGroup = memo(BarGroupInner)
BarGroup.displayName = 'BarGroup'