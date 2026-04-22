import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Compass3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Compass3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.5835 21.6L10.9479 8.71235M13.578 8.71235L20.4164 21.6M4.36278 14.7617C6.29076 17.6643 9.11555 19.4959 12.2632 19.4959C15.4108 19.4959 18.2356 17.6643 20.1636 14.7617M12.2629 3.71509C10.8104 3.71509 9.63281 4.89264 9.63281 6.34523C9.63281 7.79781 10.8104 8.97537 12.2629 8.97537C13.7155 8.97537 14.8931 7.79781 14.8931 6.34523C14.8931 4.89264 13.7155 3.71509 12.2629 3.71509ZM12.2629 3.71509V2.40002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Compass3 = memo(Compass3Inner)
Compass3.displayName = 'Compass3'