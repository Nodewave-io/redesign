import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TargetInner = forwardRef<SVGSVGElement, IconProps>(
  function Target({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M21 12H17.625M12 21C7.02944 21 3 16.9706 3 12M12 21V17.625M3 12C3 7.02944 7.02944 3 12 3M3 12H6.375M12 3V6.375" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Target = memo(TargetInner)
Target.displayName = 'Target'