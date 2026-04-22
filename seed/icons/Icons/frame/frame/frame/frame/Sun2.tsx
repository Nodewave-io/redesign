import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 25) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Sun2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Sun2({ size = 25, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 25 25" fill={color} {...props}>
        <path d="M12.023 1.76021V1M12.023 23.0461V22.2859M22.2859 12.023H23.0461M1 12.023H1.76021M19.2806 4.76622L19.8182 4.22867M4.22787 19.8175L4.76542 19.2799M19.2806 19.2799L19.8182 19.8174M4.22787 4.22861L4.76542 4.76616M18.0899 11.9815C18.0899 15.3403 15.367 18.0632 12.0082 18.0632C8.64938 18.0632 5.92652 15.3403 5.92652 11.9815C5.92652 8.62265 8.64938 5.89979 12.0082 5.89979C15.367 5.89979 18.0899 8.62265 18.0899 11.9815Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Sun2 = memo(Sun2Inner)
Sun2.displayName = 'Sun2'