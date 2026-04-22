import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Cloud3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Cloud3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.3599 18.72C14.0477 18.72 11.9999 18.72 11.9999 18.72H9.1199C9.1199 18.72 7.9874 18.72 7.1999 18.72C4.54865 18.72 2.3999 16.5708 2.3999 13.92C2.3999 11.7427 3.84928 9.90331 5.83678 9.31597C6.87365 6.94034 9.24365 5.28003 11.9999 5.28003C15.4218 5.28003 18.2474 7.83894 18.6655 11.1478C20.3493 11.5552 21.5999 13.0716 21.5999 14.88C21.5999 17.0007 19.8805 18.72 17.7599 18.72C16.8337 18.72 16.2972 18.72 15.3599 18.72Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Cloud3 = memo(Cloud3Inner)
Cloud3.displayName = 'Cloud3'