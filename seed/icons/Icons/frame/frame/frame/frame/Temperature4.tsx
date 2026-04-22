import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Temperature4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Temperature4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 17.3999H12.0563M16.2 17.3999C16.2 19.7195 14.3196 21.5999 12 21.5999C9.68045 21.5999 7.80005 19.7195 7.80005 17.3999C7.80005 15.9727 8.51196 14.7117 9.60005 13.9527V4.79833C9.60005 3.47285 10.6746 2.3999 12 2.3999C13.3255 2.3999 14.4 3.47442 14.4 4.7999V13.9527C15.2593 14.7218 16.2 16.156 16.2 17.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Temperature4 = memo(Temperature4Inner)
Temperature4.displayName = 'Temperature4'