import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignUp2Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignUp2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.9999 13.0334L11.9999 7.20002M11.9999 7.20002L17.9999 13.0334M11.9999 7.20002L11.9999 21.6M21.5999 2.40002L2.3999 2.40003" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignUp2 = memo(AlignUp2Inner)
AlignUp2.displayName = 'AlignUp2'