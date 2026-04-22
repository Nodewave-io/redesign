import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LockOpen3Inner = forwardRef<SVGSVGElement, IconProps>(
  function LockOpen3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.37505 7.88562C6.37505 4.84671 8.78362 2.3999 11.775 2.3999C13.6385 2.3999 15.2757 3.34934 16.2455 4.7999M6.60005 8.7999C5.61005 8.7999 4.80005 9.62276 4.80005 10.6285V19.7713C4.80005 20.777 5.61005 21.5999 6.60005 21.5999H17.4001C18.3901 21.5999 19.2001 20.777 19.2001 19.7713V10.6285C19.2001 9.62276 18.3901 8.7999 17.4001 8.7999H6.60005Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const LockOpen3 = memo(LockOpen3Inner)
LockOpen3.displayName = 'LockOpen3'