import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Presentation2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Presentation2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.5999 16.2L7.7999 21M16.5935 20.9333L14.4722 16.2664M14.3999 10.1574L11.9456 12.6M11.9456 12.6L9.5999 10.2678M11.9456 12.6V6.6M4.7999 16.2C3.47442 16.2 2.3999 15.1255 2.3999 13.8V5.4C2.3999 4.07452 3.47442 3 4.7999 3H19.1999C20.5254 3 21.5999 4.07452 21.5999 5.4V13.8C21.5999 15.1255 20.5254 16.2 19.1999 16.2H4.7999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Presentation2 = memo(Presentation2Inner)
Presentation2.displayName = 'Presentation2'