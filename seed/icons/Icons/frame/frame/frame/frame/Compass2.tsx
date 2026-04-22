import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Compass2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Compass2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.5835 21.5999L10.9479 8.71223M13.578 8.71223L20.4164 21.5999M4.36278 14.7615C6.29076 17.6642 9.11555 19.4958 12.2632 19.4958C15.4108 19.4958 18.2356 17.6642 20.1636 14.7615M12.2629 3.71497C10.8104 3.71497 9.63281 4.89252 9.63281 6.34511C9.63281 7.79769 10.8104 8.97524 12.2629 8.97524C13.7155 8.97524 14.8931 7.79769 14.8931 6.34511C14.8931 4.89252 13.7155 3.71497 12.2629 3.71497ZM12.2629 3.71497V2.3999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Compass2 = memo(Compass2Inner)
Compass2.displayName = 'Compass2'