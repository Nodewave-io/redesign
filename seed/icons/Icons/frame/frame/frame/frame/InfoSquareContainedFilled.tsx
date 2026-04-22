import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const InfoSquareContainedFilledInner = forwardRef<SVGSVGElement, IconProps>(
  function InfoSquareContainedFilled({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9996 7.70466V7.78131M10.5934 11.0625H12.4684L12.4688 16.6875M17.625 3C19.489 3 21 4.51103 21 6.37498L21 17.625C21 19.489 19.489 21 17.625 21H6.375C4.51104 21 3 19.489 3 17.625V6.37498C3 4.51103 4.51104 3 6.375 3H17.625Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const InfoSquareContainedFilled = memo(InfoSquareContainedFilledInner)
InfoSquareContainedFilled.displayName = 'InfoSquareContainedFilled'