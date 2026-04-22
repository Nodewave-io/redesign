import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignDownInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 21.6L21.5999 21.6M7.7999 4.80002L7.7999 14.4C7.7999 15.7255 8.87442 16.8 10.1999 16.8H13.7999C15.1254 16.8 16.1999 15.7255 16.1999 14.4L16.1999 4.80003C16.1999 3.47454 15.1254 2.40003 13.7999 2.40002L10.1999 2.40002C8.87442 2.40002 7.79991 3.47454 7.7999 4.80002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignDown = memo(AlignDownInner)
AlignDown.displayName = 'AlignDown'