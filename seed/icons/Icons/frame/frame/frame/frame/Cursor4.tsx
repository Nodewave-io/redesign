import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Cursor4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Cursor4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 25" fill={color} {...props}>
        <path d="M5.4731 14.2477L3.78594 15.9348M3.60964 9.74825H1.22363M3.78594 3.56279L5.4731 5.24988M9.97274 1L9.97274 3.38591M16.1585 3.56279L14.4713 5.24988M21.824 19.4658L19.962 21.3279C19.7563 21.5336 19.4228 21.5336 19.2171 21.3279L16.2815 18.3923C16.0596 18.1703 15.6939 18.1906 15.4978 18.4357L13.5235 20.9036C13.2563 21.2376 12.7234 21.1306 12.6059 20.7193L9.42248 9.57746C9.30897 9.18016 9.67628 8.81285 10.0736 8.92637L21.2154 12.1097C21.6267 12.2273 21.7337 12.7602 21.3997 13.0274L18.9318 15.0017C18.6867 15.1978 18.6664 15.5634 18.8884 15.7854L21.824 18.721C22.0297 18.9267 22.0297 19.2602 21.824 19.4658Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Cursor4 = memo(Cursor4Inner)
Cursor4.displayName = 'Cursor4'