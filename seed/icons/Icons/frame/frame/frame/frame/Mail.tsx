import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MailInner = forwardRef<SVGSVGElement, IconProps>(
  function Mail({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.125 6.125L12 11.1875L20.4375 6.125M5.25 18.3044C4.00736 18.3044 3 17.297 3 16.0544V7.25C3 6.00736 4.00736 5 5.25 5H18.75C19.9926 5 21 6.00736 21 7.25V16.0543C21 17.297 19.9926 18.3044 18.75 18.3044H5.25Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Mail = memo(MailInner)
Mail.displayName = 'Mail'