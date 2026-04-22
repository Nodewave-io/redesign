import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Alarm2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Alarm2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 9.31199V12.4499C12 12.6536 12.081 12.8489 12.225 12.9929L13.92 14.688M5.85605 18.912L3.16805 21.6M20.832 21.6L18.144 18.912M4.80005 2.39999L1.80005 5.39999M22.2 5.39999L19.2 2.39999M20.448 12.768C20.448 17.4337 16.6658 21.216 12 21.216C7.33435 21.216 3.55205 17.4337 3.55205 12.768C3.55205 8.10229 7.33435 4.31999 12 4.31999C16.6658 4.31999 20.448 8.10229 20.448 12.768Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Alarm2 = memo(Alarm2Inner)
Alarm2.displayName = 'Alarm2'