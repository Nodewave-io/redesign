import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PointerInner = forwardRef<SVGSVGElement, IconProps>(
  function Pointer({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.2631 14.0019L12.4968 20.4627C12.9155 21.6737 14.6134 21.7142 15.0893 20.5245L21.4975 4.50638C21.9433 3.39205 20.8561 2.2774 19.731 2.69527L3.30186 8.79714C2.10127 9.24304 2.0986 10.9402 3.29777 11.3899L10.2631 14.0019Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Pointer = memo(PointerInner)
Pointer.displayName = 'Pointer'