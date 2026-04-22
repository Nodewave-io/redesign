import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CarInner = forwardRef<SVGSVGElement, IconProps>(
  function Car({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4 14.5V12.1707C4 11.0392 4.89543 10.122 6 10.122M4 14.5C4 15.6315 4.89543 16.5488 6 16.5488H18C19.1046 16.5488 20 15.6315 20 14.5M4 14.5V17.6341C4 18.3885 4.59695 19 5.33333 19H6.66667C7.40305 19 8 18.3885 8 17.6341V16.5488M20 14.5V12.1707C20 11.0392 19.1046 10.122 18 10.122H6M20 14.5V17.6341C20 18.3885 19.403 19 18.6667 19H17.3333C16.597 19 16 18.3885 16 17.6341V16.5488M6 10.122L7.06939 6.01392C7.22504 5.41602 7.75364 5 8.3577 5H15.7057C16.2796 5 16.7891 5.3762 16.9706 5.93393L18.3333 10.122M6.33333 13.1951H8.66667M15.3333 13.1951H17.6667" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Car = memo(CarInner)
Car.displayName = 'Car'