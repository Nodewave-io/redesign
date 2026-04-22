import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignLeft3Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignLeft3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.4001 3.59998L21.6001 3.59998M2.4001 8.79998L16.5242 8.79998M2.4001 14L21.6001 14M2.4001 19.2L12.6622 19.2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignLeft3 = memo(AlignLeft3Inner)
AlignLeft3.displayName = 'AlignLeft3'