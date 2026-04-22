import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UnionInner = forwardRef<SVGSVGElement, IconProps>(
  function Union({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.7999 21.6H12.7999C14.1254 21.6 15.1999 20.5255 15.1999 19.2V15.2H19.1999C20.5254 15.2 21.5999 14.1255 21.5999 12.8V4.80003C21.5999 3.47454 20.5254 2.40002 19.1999 2.40002H11.1999C9.87442 2.40002 8.7999 3.47454 8.7999 4.80002V8.80002H4.7999C3.47442 8.80002 2.3999 9.87454 2.3999 11.2V19.2C2.3999 20.5255 3.47442 21.6 4.7999 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Union = memo(UnionInner)
Union.displayName = 'Union'