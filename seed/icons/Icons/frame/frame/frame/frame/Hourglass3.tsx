import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Hourglass3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Hourglass3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.25 3H19.25M5.25 21H19.25M17.5 3V5.64723C17.5 6.33742 17.262 7.0065 16.8262 7.54167L13.9511 11.072C13.4422 11.6969 13.4543 12.5794 13.9801 13.1912L16.775 16.4423C17.2428 16.9865 17.5 17.6803 17.5 18.3979V21M7 3V5.64723C7 6.33742 7.23798 7.0065 7.67383 7.54167L10.5489 11.072C11.0578 11.6969 11.0457 12.5794 10.5199 13.1912L7.72505 16.4423C7.25724 16.9865 7 17.6803 7 18.3979V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Hourglass3 = memo(Hourglass3Inner)
Hourglass3.displayName = 'Hourglass3'