import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Check2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Check2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7 11.8784C7.94144 12.5631 9.82432 14.4459 10.5946 15.7297C11.536 13.6757 13.9324 9.05405 16.5 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Check2 = memo(Check2Inner)
Check2.displayName = 'Check2'