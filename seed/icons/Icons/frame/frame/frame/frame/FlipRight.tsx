import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlipRightInner = forwardRef<SVGSVGElement, IconProps>(
  function FlipRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.0462 4.80019L21.6001 9.41569M21.6001 9.41569L17.0462 14.0312M21.6001 9.41569L6.4001 9.41569C4.19096 9.41569 2.4001 11.2065 2.4001 13.4157L2.4001 15.2002C2.4001 17.4093 4.19096 19.2002 6.4001 19.2002L12.0001 19.2002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlipRight = memo(FlipRightInner)
FlipRight.displayName = 'FlipRight'