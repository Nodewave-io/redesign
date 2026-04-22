import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRefresh5Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRefresh5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 20.6942C7.02944 20.6942 3 16.8016 3 11.9999C3 8.96454 4.61019 6.29246 7.05044 4.73732M13.3635 3.40476C17.687 4.03953 21 7.64598 21 11.9999C21 15.1321 19.2855 17.8775 16.7136 19.4079M13.1255 5.61085L10.739 3.30542L13.1255 1V5.61085ZM10.7381 18.3892L13.1246 20.6946L10.7381 23L10.7381 18.3892Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRefresh5 = memo(ArrowRefresh5Inner)
ArrowRefresh5.displayName = 'ArrowRefresh5'