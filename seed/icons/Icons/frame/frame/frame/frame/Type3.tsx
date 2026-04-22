import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Type3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Type3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.2088 16.2H12.124M12.124 16.2H14.128M12.124 16.2V7.80002M12.124 7.80002H8.9999C8.66853 7.80002 8.3999 8.06865 8.3999 8.40002V9.28238M12.124 7.80002H14.9999C15.3313 7.80002 15.5999 8.06865 15.5999 8.40002V9.52944M4.7999 21.6H19.1999C20.5254 21.6 21.5999 20.5255 21.5999 19.2V4.80002C21.5999 3.47454 20.5254 2.40002 19.1999 2.40002H4.7999C3.47442 2.40002 2.3999 3.47454 2.3999 4.80002V19.2C2.3999 20.5255 3.47442 21.6 4.7999 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Type3 = memo(Type3Inner)
Type3.displayName = 'Type3'