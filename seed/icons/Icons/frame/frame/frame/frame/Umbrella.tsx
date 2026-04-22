import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const UmbrellaInner = forwardRef<SVGSVGElement, IconProps>(
  function Umbrella({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.1999 13.2V18.4C11.1999 19.9464 12.4535 21.2 13.9999 21.2C15.5463 21.2 16.7999 19.9464 16.7999 18.4V18M21.5999 12.4H2.3999C2.3999 7.09811 6.69797 2.80005 11.9999 2.80005C17.3018 2.80005 21.5999 7.09811 21.5999 12.4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Umbrella = memo(UmbrellaInner)
Umbrella.displayName = 'Umbrella'