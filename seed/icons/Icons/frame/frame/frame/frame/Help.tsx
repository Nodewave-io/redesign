import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HelpInner = forwardRef<SVGSVGElement, IconProps>(
  function Help({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.3865 14.3865C13.0685 15.7045 10.9315 15.7045 9.61351 14.3865M14.3865 14.3865C15.7045 13.0685 15.7045 10.9315 14.3865 9.61351M14.3865 14.3865L17.9662 17.9662M9.61351 14.3865C8.2955 13.0685 8.2955 10.9315 9.61351 9.61351M9.61351 14.3865L6.03379 17.9662M9.61351 9.61351C10.9315 8.2955 13.0685 8.2955 14.3865 9.61351M9.61351 9.61351L6.03379 6.03379M14.3865 9.61351L17.9662 6.03379M18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.364Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Help = memo(HelpInner)
Help.displayName = 'Help'