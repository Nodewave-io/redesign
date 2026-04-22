import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignRight2Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignRight2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.9666 6.00003L16.7999 12M16.7999 12L10.9666 18M16.7999 12L2.3999 12M21.5999 21.6L21.5999 2.40002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignRight2 = memo(AlignRight2Inner)
AlignRight2.displayName = 'AlignRight2'