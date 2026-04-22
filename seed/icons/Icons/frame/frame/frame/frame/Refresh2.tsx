import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Refresh2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Refresh2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.81605 21.5999L2.3999 17.9999M2.3999 17.9999L5.81605 14.3999M2.3999 17.9999H19.1999C20.5254 17.9999 21.5999 16.9254 21.5999 15.5999V11.9999M18.1838 2.3999L21.5999 5.9999M21.5999 5.9999L18.1838 9.5999M21.5999 5.9999L4.7999 5.9999C3.47442 5.9999 2.3999 7.07442 2.3999 8.3999L2.3999 11.9999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Refresh2 = memo(Refresh2Inner)
Refresh2.displayName = 'Refresh2'