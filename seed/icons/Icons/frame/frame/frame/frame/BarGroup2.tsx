import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BarGroup2Inner = forwardRef<SVGSVGElement, IconProps>(
  function BarGroup2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.9435 21V11.024C14.9435 10.4717 14.4958 10.024 13.9435 10.024H9.88528C9.333 10.024 8.88528 10.4717 8.88528 11.024V21M14.9435 21L14.9421 16.6803C14.9419 16.1279 15.3897 15.68 15.9421 15.68H20C20.5523 15.68 21 16.1277 21 16.68V20C21 20.5523 20.5523 21 20 21H14.9435ZM14.9435 21H8.88528M8.88528 21V4C8.88528 3.44772 8.43757 3 7.88528 3H4C3.44771 3 3 3.44772 3 4V20C3 20.5523 3.44771 21 4 21H8.88528Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BarGroup2 = memo(BarGroup2Inner)
BarGroup2.displayName = 'BarGroup2'