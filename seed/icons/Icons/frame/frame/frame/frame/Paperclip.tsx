import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PaperclipInner = forwardRef<SVGSVGElement, IconProps>(
  function Paperclip({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.85714 7.92878V13.9288C9.85714 15.1122 10.8165 16.0716 12 16.0716C13.1835 16.0716 14.1429 15.1122 14.1429 13.9288V7.7145C14.1429 5.46591 12.32 3.64307 10.0714 3.64307C7.82284 3.64307 6 5.46591 6 7.71449V14.3574C6 17.6711 8.68629 20.3574 12 20.3574C15.3137 20.3574 18 17.6711 18 14.3574V7.92878" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Paperclip = memo(PaperclipInner)
Paperclip.displayName = 'Paperclip'