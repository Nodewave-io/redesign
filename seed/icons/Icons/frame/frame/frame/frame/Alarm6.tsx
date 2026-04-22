import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Alarm6Inner = forwardRef<SVGSVGElement, IconProps>(
  function Alarm6({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.85605 18.912L3.16805 21.6M20.832 21.6L18.144 18.912L3.30005 3.89999L1.80005 5.39999M22.2 5.39999L19.2 2.39999M9.60005 4.66577C10.3608 4.44076 11.1663 4.31999 12 4.31999C16.6658 4.31999 20.448 8.10229 20.448 12.768C20.448 13.5406 20.3443 14.289 20.1501 15M17.4 19.2651C15.9359 20.4833 14.0536 21.216 12 21.216C7.33435 21.216 3.55205 17.4337 3.55205 12.768C3.55205 10.635 4.34251 8.68673 5.64647 7.19999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Alarm6 = memo(Alarm6Inner)
Alarm6.displayName = 'Alarm6'