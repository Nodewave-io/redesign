import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Globe3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Globe3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.75 17.9531L15.4615 14.0769H13.3846L12 12.6923L14.7692 8.53846H19.6154M7.15385 5.07692L8.62236 6.54543C9.41145 7.33453 9.65436 8.51795 9.23991 9.55408C8.81626 10.6132 7.79047 11.3077 6.64977 11.3077H3.69231M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Globe3 = memo(Globe3Inner)
Globe3.displayName = 'Globe3'