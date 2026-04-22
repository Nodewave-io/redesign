import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DeleteInner = forwardRef<SVGSVGElement, IconProps>(
  function Delete({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7199 9.84L13.2799 12.4M13.2799 12.4L15.8399 14.96M13.2799 12.4L15.8399 9.84M13.2799 12.4L10.7199 14.96M7.22223 18.8L20.3199 18.8C21.0268 18.8 21.5999 18.2269 21.5999 17.52V7.28C21.5999 6.57308 21.0268 6 20.3199 6L7.22223 6L2.85334 11.7982C2.58489 12.1545 2.58489 12.6455 2.85334 13.0018L7.22223 18.8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Delete = memo(DeleteInner)
Delete.displayName = 'Delete'