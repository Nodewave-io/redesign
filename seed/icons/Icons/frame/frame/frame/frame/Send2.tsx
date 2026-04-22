import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 25) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Send2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Send2({ size = 25, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 25 24" fill={color} {...props}>
        <path d="M23.8 12L11.1605 12M5.83431 16.1693H3.4M5.83431 12.1464H1M5.83431 8.12357H3.4M10.1074 4.59597L23.3627 11.0228C24.179 11.4186 24.179 12.5815 23.3627 12.9772L10.1074 19.4041C9.19931 19.8443 8.23411 18.9161 8.63861 17.9915L11.0695 12.4353C11.1909 12.1578 11.1909 11.8422 11.0695 11.5647L8.63861 6.00849C8.23412 5.08392 9.19931 4.15569 10.1074 4.59597Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Send2 = memo(Send2Inner)
Send2.displayName = 'Send2'