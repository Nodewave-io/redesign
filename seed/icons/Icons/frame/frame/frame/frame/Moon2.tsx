import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Moon2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Moon2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.9001 11.7003V8.70034M18.9001 8.70034V5.70034M18.9001 8.70034L21.9001 8.70034M18.9001 8.70034H15.9001M14.1001 5.70034V3.90034M14.1001 3.90034V2.10034M14.1001 3.90034L15.9001 3.90034M14.1001 3.90034L12.3001 3.90034M21.3 14.9398C20.3977 15.2134 19.4404 15.3605 18.4488 15.3605C13.0308 15.3605 8.63863 10.9684 8.63863 5.55037C8.63863 4.55915 8.78564 3.60227 9.05904 2.70034C5.03161 3.92172 2.1001 7.66338 2.1001 12.0897C2.1001 17.5077 6.49226 21.8999 11.9103 21.8999C16.337 21.8999 20.079 18.9678 21.3 14.9398Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Moon2 = memo(Moon2Inner)
Moon2.displayName = 'Moon2'