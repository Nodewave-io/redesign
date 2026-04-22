import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Underline2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Underline2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.0341 16.8001H7.80049M15.2982 6.6046V9.90231C15.2982 11.7236 13.8218 13.2 12.0005 13.2C10.1792 13.2 8.70277 11.7236 8.70277 9.90231V6.6046M4.7999 21.6H19.1999C20.5254 21.6 21.5999 20.5255 21.5999 19.2V4.80002C21.5999 3.47454 20.5254 2.40002 19.1999 2.40002H4.7999C3.47442 2.40002 2.3999 3.47454 2.3999 4.80002V19.2C2.3999 20.5255 3.47442 21.6 4.7999 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Underline2 = memo(Underline2Inner)
Underline2.displayName = 'Underline2'