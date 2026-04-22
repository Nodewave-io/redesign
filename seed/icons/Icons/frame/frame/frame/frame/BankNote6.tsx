import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BankNote6Inner = forwardRef<SVGSVGElement, IconProps>(
  function BankNote6({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.9999 5.9999V10.1999M17.9999 5.9999V10.1999M17.3999 14.3999H19.7999C20.794 14.3999 21.5999 13.594 21.5999 12.5999V4.1999C21.5999 3.20579 20.794 2.3999 19.7999 2.3999H4.1999C3.20579 2.3999 2.3999 3.20579 2.3999 4.1999V12.5999C2.3999 13.594 3.20579 14.3999 4.1999 14.3999H6.5999M8.60484 18.2056L11.9989 21.5997M11.9989 21.5997L15.1644 18.4342M11.9989 21.5997L11.9991 14.6574M14.3999 8.3999C14.3999 9.72539 13.3254 10.7999 11.9999 10.7999C10.6744 10.7999 9.5999 9.72539 9.5999 8.3999C9.5999 7.07442 10.6744 5.9999 11.9999 5.9999C13.3254 5.9999 14.3999 7.07442 14.3999 8.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BankNote6 = memo(BankNote6Inner)
BankNote6.displayName = 'BankNote6'