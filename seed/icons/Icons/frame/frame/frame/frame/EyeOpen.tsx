import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const EyeOpenInner = forwardRef<SVGSVGElement, IconProps>(
  function EyeOpen({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.3999 12.0294C14.3999 13.3192 13.3254 14.3647 11.9999 14.3647C10.6744 14.3647 9.5999 13.3192 9.5999 12.0294C9.5999 10.7396 10.6744 9.69402 11.9999 9.69402C13.3254 9.69402 14.3999 10.7396 14.3999 12.0294Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const EyeOpen = memo(EyeOpenInner)
EyeOpen.displayName = 'EyeOpen'