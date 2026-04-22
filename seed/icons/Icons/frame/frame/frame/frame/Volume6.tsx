import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Volume6Inner = forwardRef<SVGSVGElement, IconProps>(
  function Volume6({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.7692 9.34474C20.2486 11.1677 20.4575 13.5939 19.0503 15.7409M13.9598 5L9.07702 9.0698H4V14.9296L9.07702 14.9282L13.9598 19V5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Volume6 = memo(Volume6Inner)
Volume6.displayName = 'Volume6'