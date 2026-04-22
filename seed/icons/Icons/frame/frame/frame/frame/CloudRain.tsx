import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CloudRainInner = forwardRef<SVGSVGElement, IconProps>(
  function CloudRain({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 15.5999L10.2 18.5999M15 18.5999L13.2 21.5999M21 8.3999C21 11.7136 18.3137 14.3999 15 14.3999C13.5438 14.3999 11.4 14.3999 11.4 14.3999C11.4 14.3999 9.11306 14.3999 7.8 14.3999C5.14903 14.3999 3 12.2509 3 9.5999C3 6.94894 5.14903 4.7999 7.8 4.7999C8.54469 4.7999 9.24977 4.96949 9.87873 5.27214C10.9331 3.54943 12.8323 2.3999 15 2.3999C18.3137 2.3999 21 5.08619 21 8.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CloudRain = memo(CloudRainInner)
CloudRain.displayName = 'CloudRain'