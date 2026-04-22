import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const IndentLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function IndentLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.39988 3.59998L21.5999 3.59998M11.9999 8.79998L21.5999 8.79998M11.9999 14L21.5999 14M2.39988 19.2H21.5999M2.39988 14.4L2.39941 8.39998L7.19988 11.4L2.39988 14.4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const IndentLeft = memo(IndentLeftInner)
IndentLeft.displayName = 'IndentLeft'