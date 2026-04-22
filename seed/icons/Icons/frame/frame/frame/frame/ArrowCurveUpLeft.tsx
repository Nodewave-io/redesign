import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowCurveUpLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowCurveUpLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.20005 8.91362L9.51406 3.59961M9.51406 3.59961L14.8281 8.91362M9.51406 3.59961L9.51406 16.3996C9.51406 18.6087 11.3049 20.3996 13.5141 20.3996L19.8 20.3996" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowCurveUpLeft = memo(ArrowCurveUpLeftInner)
ArrowCurveUpLeft.displayName = 'ArrowCurveUpLeft'