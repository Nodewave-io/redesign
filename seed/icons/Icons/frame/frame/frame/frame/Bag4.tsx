import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Bag4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Bag4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.5999 8.3998V5.39981C15.5999 3.41158 13.9881 1.7998 11.9999 1.7998C10.0117 1.7998 8.3999 3.41158 8.3999 5.3998V8.3998M4.72717 22.1998H19.2726C20.5579 22.1998 21.5999 21.1772 21.5999 19.9158L20.109 7.79977C20.109 6.53835 19.067 5.51576 17.7817 5.51576H5.92717C4.64186 5.51576 3.5999 6.53835 3.5999 7.79977L2.3999 19.9158C2.3999 21.1772 3.44186 22.1998 4.72717 22.1998Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Bag4 = memo(Bag4Inner)
Bag4.displayName = 'Bag4'