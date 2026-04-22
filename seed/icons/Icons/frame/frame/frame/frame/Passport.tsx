import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PassportInner = forwardRef<SVGSVGElement, IconProps>(
  function Passport({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.60005 16.7999H14.4M6.80005 21.5999H17.2001C18.3046 21.5999 19.2001 20.7045 19.2001 19.5999V4.3999C19.2001 3.29533 18.3046 2.3999 17.2 2.3999H6.80005C5.69548 2.3999 4.80005 3.29533 4.80005 4.3999V19.5999C4.80005 20.7045 5.69548 21.5999 6.80005 21.5999ZM14.4 8.3999C14.4 9.72539 13.3255 10.7999 12 10.7999C10.6746 10.7999 9.60005 9.72539 9.60005 8.3999C9.60005 7.07442 10.6746 5.9999 12 5.9999C13.3255 5.9999 14.4 7.07442 14.4 8.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Passport = memo(PassportInner)
Passport.displayName = 'Passport'