import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRefresh4Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRefresh4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8 19.3688C5.60879 17.9836 4 15.3947 4 12.4295C4 9.06753 6.06817 6.18926 9 5.00086M9 16.9357L9 20.9412H5M16 5.57241C18.3912 6.95755 20 9.54647 20 12.5117C20 15.8736 17.9318 18.7519 15 19.9403M15 8.00549V4L19 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRefresh4 = memo(ArrowRefresh4Inner)
ArrowRefresh4.displayName = 'ArrowRefresh4'