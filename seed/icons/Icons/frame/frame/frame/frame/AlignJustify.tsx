import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignJustifyInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignJustify({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.4001 3.59998L21.6001 3.59998M2.4001 8.79998L21.6001 8.79998M2.4001 14L21.6001 14M2.4001 19.2L21.6001 19.2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignJustify = memo(AlignJustifyInner)
AlignJustify.displayName = 'AlignJustify'