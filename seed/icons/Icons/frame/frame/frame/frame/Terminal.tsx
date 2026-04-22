import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TerminalInner = forwardRef<SVGSVGElement, IconProps>(
  function Terminal({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7477 18.6782H21.5999M2.39991 5.32172L9.07816 12L2.3999 18.6782" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Terminal = memo(TerminalInner)
Terminal.displayName = 'Terminal'