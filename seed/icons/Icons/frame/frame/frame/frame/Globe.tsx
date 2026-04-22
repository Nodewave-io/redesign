import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GlobeInner = forwardRef<SVGSVGElement, IconProps>(
  function Globe({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3M12 21C9.82538 21 8.0625 16.9706 8.0625 12C8.0625 7.02944 9.82538 3 12 3M12 21C14.1746 21 15.9375 16.9706 15.9375 12C15.9375 7.02944 14.1746 3 12 3M4.6875 16.3744C6.33632 15.4302 9.07573 14.8125 12.1764 14.8125C15.4124 14.8125 18.255 15.4854 19.875 16.5M4.6875 7.62558C6.33632 8.56975 9.07573 9.1875 12.1764 9.1875C15.4124 9.1875 18.255 8.5146 19.875 7.5" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Globe = memo(GlobeInner)
Globe.displayName = 'Globe'