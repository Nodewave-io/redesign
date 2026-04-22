import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Server3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Server3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.3999 16.2H11.3999M6.5999 16.2902V16.2M2.3999 15L4.41404 4.92932C4.6384 3.8075 5.6234 3 6.76743 3H16.7042C17.8156 3 18.7816 3.76299 19.039 4.84411L21.5999 15.6M16.8002 11.4H7.20006C4.54903 11.4 2.39997 13.5491 2.40006 16.2002C2.40014 18.8511 4.54915 21 7.20006 21H16.8002C19.4512 21 21.6002 18.851 21.6002 16.2C21.6002 13.549 19.4512 11.4 16.8002 11.4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Server3 = memo(Server3Inner)
Server3.displayName = 'Server3'