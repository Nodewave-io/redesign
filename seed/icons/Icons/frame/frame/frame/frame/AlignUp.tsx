import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignUpInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 2.40002L2.3999 2.40002M16.1999 19.2V9.60002C16.1999 8.27454 15.1254 7.20002 13.7999 7.20002L10.1999 7.20002C8.87442 7.20002 7.7999 8.27454 7.7999 9.60002L7.7999 19.2C7.7999 20.5255 8.87442 21.6 10.1999 21.6L13.7999 21.6C15.1254 21.6 16.1999 20.5255 16.1999 19.2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignUp = memo(AlignUpInner)
AlignUp.displayName = 'AlignUp'