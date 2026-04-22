import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PentagonInner = forwardRef<SVGSVGElement, IconProps>(
  function Pentagon({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 3L21.5999 9.87539L17.933 21H6.06678L2.3999 9.87539L11.9999 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Pentagon = memo(PentagonInner)
Pentagon.displayName = 'Pentagon'