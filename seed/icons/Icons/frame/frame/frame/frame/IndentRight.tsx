import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const IndentRightInner = forwardRef<SVGSVGElement, IconProps>(
  function IndentRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 19.2L2.3999 19.2M11.9999 14H2.3999M11.9999 8.79997L2.3999 8.79997M21.5999 3.59998L2.39991 3.59998M21.5999 8.39998L21.6004 14.4L16.7999 11.4L21.5999 8.39998Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const IndentRight = memo(IndentRightInner)
IndentRight.displayName = 'IndentRight'