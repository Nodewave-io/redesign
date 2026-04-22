import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlipLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function FlipLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.95377 4.80019L2.3999 9.41569M2.3999 9.41569L6.95377 14.0312M2.3999 9.41569L17.5999 9.41569C19.809 9.41569 21.5999 11.2065 21.5999 13.4157L21.5999 15.2002C21.5999 17.4093 19.809 19.2002 17.5999 19.2002L11.9999 19.2002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlipLeft = memo(FlipLeftInner)
FlipLeft.displayName = 'FlipLeft'