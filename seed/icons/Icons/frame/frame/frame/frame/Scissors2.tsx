import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Scissors2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Scissors2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <g clip-path="url(#clip0_101_5243)">
        <path d="M3.59995 9.39506L20.4 16.7999M20.4 7.1999L3.59995 14.6047M17.4003 12.0002L17.3768 12.0237M22.2238 12.0002L22.2003 12.0237M4.79995 9.5999C2.81173 9.5999 1.19995 7.98813 1.19995 5.9999C1.19995 4.01168 2.81173 2.3999 4.79995 2.3999C6.78818 2.3999 8.39995 4.01168 8.39995 5.9999C8.39995 7.98813 6.78818 9.5999 4.79995 9.5999ZM4.79995 21.5999C2.81173 21.5999 1.19995 19.9881 1.19995 17.9999C1.19995 16.0117 2.81173 14.3999 4.79995 14.3999C6.78818 14.3999 8.39995 16.0117 8.39995 17.9999C8.39995 19.9881 6.78818 21.5999 4.79995 21.5999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
        <clipPath id="clip0_101_5243">
        <rect width="24" height="24" fill={color} transform="translate(24 1.04907e-06) rotate(90)"/>
        </clipPath>
        </defs>
      </svg>
    )
  }
)

export const Scissors2 = memo(Scissors2Inner)
Scissors2.displayName = 'Scissors2'