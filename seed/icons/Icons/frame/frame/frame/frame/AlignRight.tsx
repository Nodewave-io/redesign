import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignRightInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 21.6L21.5999 2.40002M4.7999 16.2L14.3999 16.2C15.7254 16.2 16.7999 15.1255 16.7999 13.8V10.2C16.7999 8.87454 15.7254 7.80002 14.3999 7.80002L4.7999 7.80002C3.47442 7.80002 2.3999 8.87454 2.3999 10.2L2.3999 13.8C2.3999 15.1255 3.47442 16.2 4.7999 16.2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignRight = memo(AlignRightInner)
AlignRight.displayName = 'AlignRight'