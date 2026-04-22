import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Marker4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Marker4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 9.5999V17.5999M8.3999 13.8907C4.88171 14.484 2.3999 15.9212 2.3999 17.5999C2.3999 19.809 6.69797 21.5999 11.9999 21.5999C17.3018 21.5999 21.5999 19.809 21.5999 17.5999C21.5999 15.9212 19.1181 14.484 15.5999 13.8907M15.1999 5.5999C15.1999 7.36721 13.7672 8.7999 11.9999 8.7999C10.2326 8.7999 8.7999 7.36721 8.7999 5.5999C8.7999 3.83259 10.2326 2.3999 11.9999 2.3999C13.7672 2.3999 15.1999 3.83259 15.1999 5.5999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Marker4 = memo(Marker4Inner)
Marker4.displayName = 'Marker4'