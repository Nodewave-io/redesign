import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Send3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Send3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.3999 11.8298H10.5159M4.7999 21.6C3.47442 21.6 2.3999 20.5255 2.3999 19.2V4.8C2.3999 3.47452 3.47442 2.4 4.7999 2.4H19.1999C20.5254 2.4 21.5999 3.47452 21.5999 4.8V19.2C21.5999 20.5255 20.5254 21.6 19.1999 21.6H4.7999ZM8.3999 15.2416V8.2594C8.3999 7.47102 9.23117 6.95958 9.93489 7.31499L16.2188 10.4887C16.9605 10.8633 17.0008 11.9073 16.2902 12.3379L10.0063 16.1464C9.30119 16.5737 8.3999 16.0661 8.3999 15.2416Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Send3 = memo(Send3Inner)
Send3.displayName = 'Send3'