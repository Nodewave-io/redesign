import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowExpand3Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowExpand3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.2065 3C13.6542 3 13.2065 3.44772 13.2065 4C13.2065 4.55228 13.6542 5 14.2065 5V3ZM20 4H21C21 3.44772 20.5523 3 20 3V4ZM19 9.79311C19 10.3454 19.4477 10.7931 20 10.7931C20.5523 10.7931 21 10.3454 21 9.79311H19ZM13.2409 10.7586L12.5338 10.0515L12.5338 10.0515L13.2409 10.7586ZM9.79349 21C10.3458 21 10.7935 20.5523 10.7935 20C10.7935 19.4477 10.3458 19 9.79349 19V21ZM4 20H3C3 20.5523 3.44772 21 4 21V20ZM5 14.2069C5 13.6546 4.55228 13.2069 4 13.2069C3.44772 13.2069 3 13.6546 3 14.2069H5ZM14.2065 5H20V3H14.2065V5ZM19 4V9.79311H21V4H19ZM19.2929 3.29287L12.5338 10.0515L13.948 11.4658L20.7071 4.70713L19.2929 3.29287ZM9.79349 19H4V21H9.79349V19ZM5 20V14.2069H3V20H5ZM4.70712 20.7071L13.9481 11.4657L12.5338 10.0515L3.29288 19.2929L4.70712 20.7071Z" fill={color}/>
      </svg>
    )
  }
)

export const ArrowExpand3 = memo(ArrowExpand3Inner)
ArrowExpand3.displayName = 'ArrowExpand3'