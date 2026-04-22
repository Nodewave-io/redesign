import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CardDownInner = forwardRef<SVGSVGElement, IconProps>(
  function CardDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.1003 18.5786H4.5006C3.17514 18.5786 2.10064 17.5041 2.1006 16.1787L2.10034 7.17888C2.1003 5.85337 3.17483 4.77881 4.50034 4.77881H18.8998C20.2253 4.77881 21.2998 5.8527 21.2998 7.17822L21.2999 11.3788M2.69988 8.97866H20.6999M21.8997 16.7786L19.4455 19.2212M19.4455 19.2212L17.0997 16.889M19.4455 19.2212L19.4455 13.7786" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CardDown = memo(CardDownInner)
CardDown.displayName = 'CardDown'