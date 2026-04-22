import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AudioSettings2Inner = forwardRef<SVGSVGElement, IconProps>(
  function AudioSettings2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.12605 9.91302L17.7185 9.91295C19.7764 9.91295 21.4446 8.23109 21.4446 6.15642C21.4446 4.08175 19.7764 2.3999 17.7185 2.3999L6.12605 2.39998M6.12605 9.91302C4.06815 9.91302 2.3999 8.23117 2.3999 6.1565C2.3999 4.08183 4.06815 2.39998 6.12605 2.39998M6.12605 9.91302C8.18394 9.91302 9.85219 8.23117 9.85219 6.1565C9.85219 4.08183 8.18394 2.39998 6.12605 2.39998M17.8738 14.0869H6.12605C4.06816 14.0869 2.3999 15.7687 2.3999 17.8434C2.3999 19.9181 4.06815 21.5999 6.12605 21.5999H17.8738M17.8738 14.0869C19.9317 14.0869 21.5999 15.7687 21.5999 17.8434C21.5999 19.9181 19.9316 21.5999 17.8738 21.5999M17.8738 14.0869C15.8159 14.0869 14.1476 15.7687 14.1476 17.8434C14.1476 19.9181 15.8159 21.5999 17.8738 21.5999" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const AudioSettings2 = memo(AudioSettings2Inner)
AudioSettings2.displayName = 'AudioSettings2'