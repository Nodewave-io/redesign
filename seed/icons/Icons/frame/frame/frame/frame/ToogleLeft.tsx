import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ToogleLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ToogleLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.75 7.75L16.25 7.75C18.5972 7.75 20.5 9.65279 20.5 12C20.5 14.3472 18.5972 16.25 16.25 16.25L7.75 16.25M7.75 7.75C5.40279 7.75 3.5 9.65279 3.5 12C3.5 14.3472 5.40279 16.25 7.75 16.25M7.75 7.75C10.0972 7.75 12 9.65279 12 12C12 14.3472 10.0972 16.25 7.75 16.25" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const ToogleLeft = memo(ToogleLeftInner)
ToogleLeft.displayName = 'ToogleLeft'