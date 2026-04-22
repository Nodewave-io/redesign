import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LockOpen4Inner = forwardRef<SVGSVGElement, IconProps>(
  function LockOpen4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.60005 9.05591V7.86131C6.60005 4.83586 9.00862 2.3999 12 2.3999C13.5962 2.3999 15.0263 3.0934 16.0133 4.1999M12 15.6854V13.2854M19.2001 14.432C19.2001 18.3908 15.9765 21.6001 12 21.6001C8.0236 21.6001 4.80005 18.3908 4.80005 14.432C4.80005 10.4731 8.0236 7.26388 12 7.26388C15.9765 7.26388 19.2001 10.4731 19.2001 14.432Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const LockOpen4 = memo(LockOpen4Inner)
LockOpen4.displayName = 'LockOpen4'