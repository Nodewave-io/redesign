import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Component2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Component2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.00005 5.99992H15M4.80005 4.7999V19.1999C4.80005 20.5254 5.87457 21.5999 7.20005 21.5999H16.8C18.1255 21.5999 19.2 20.5254 19.2 19.1999V4.79992C19.2 3.47443 18.1255 2.39992 16.8001 2.39992L7.20005 2.3999C5.87457 2.3999 4.80005 3.47442 4.80005 4.7999ZM12 16.7999H12.0851V16.8768H12V16.7999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Component2 = memo(Component2Inner)
Component2.displayName = 'Component2'