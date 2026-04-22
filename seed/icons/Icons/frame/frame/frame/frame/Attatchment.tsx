import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AttatchmentInner = forwardRef<SVGSVGElement, IconProps>(
  function Attatchment({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.2982 12.2411L12.3721 20.1673C10.2147 22.3246 6.97931 22.5793 4.77977 20.3798C2.62244 18.2225 2.90283 15.0971 5.10237 12.8976L14.0122 3.98777C15.3758 2.62414 17.5711 2.62414 18.9347 3.98777C20.2984 5.3514 20.2984 7.54673 18.9347 8.91036L9.8685 17.9766C9.18884 18.6563 8.08688 18.6563 7.40721 17.9766C6.72754 17.2969 6.72754 16.195 7.40721 15.5153L15.4898 7.43274" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Attatchment = memo(AttatchmentInner)
Attatchment.displayName = 'Attatchment'