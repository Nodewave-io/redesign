import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SendInner = forwardRef<SVGSVGElement, IconProps>(
  function Send({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.0703 2.92958L10.4063 13.5935M3.271 8.23526L19.8769 2.47403C20.8995 2.11924 21.8807 3.10037 21.5259 4.123L15.7646 20.7289C15.37 21.8665 13.7725 21.8977 13.3337 20.7764L10.6968 14.0376C10.5651 13.7011 10.2988 13.4348 9.96226 13.3031L3.22354 10.6662C2.10219 10.2274 2.13338 8.62994 3.271 8.23526Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Send = memo(SendInner)
Send.displayName = 'Send'