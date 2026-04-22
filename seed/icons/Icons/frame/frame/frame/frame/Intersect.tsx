import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const IntersectInner = forwardRef<SVGSVGElement, IconProps>(
  function Intersect({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.1999 19.2C15.1999 20.5255 14.1254 21.6 12.7999 21.6C11.4744 21.6 4.7999 21.6 4.7999 21.6C3.47442 21.6 2.3999 20.5255 2.3999 19.2C2.3999 17.8745 2.3999 12.5255 2.3999 11.2C2.3999 9.87454 3.47442 8.80002 4.7999 8.80002L12.7999 8.80002C14.1254 8.80002 15.1999 9.87454 15.1999 11.2V19.2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21.5999 12.8C21.5999 14.1255 20.5254 15.2 19.1999 15.2C17.8744 15.2 11.1999 15.2 11.1999 15.2C9.87442 15.2 8.7999 14.1255 8.7999 12.8C8.7999 11.4745 8.7999 6.12551 8.7999 4.80002C8.7999 3.47454 9.87442 2.40002 11.1999 2.40002L19.1999 2.40003C20.5254 2.40003 21.5999 3.47454 21.5999 4.80003V12.8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Intersect = memo(IntersectInner)
Intersect.displayName = 'Intersect'