import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignRight3Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignRight3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 19.2H2.3999M21.5999 14H7.47576M21.5999 8.79997H2.3999M21.5999 3.59998L11.3378 3.59998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignRight3 = memo(AlignRight3Inner)
AlignRight3.displayName = 'AlignRight3'