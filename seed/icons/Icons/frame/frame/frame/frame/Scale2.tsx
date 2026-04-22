import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Scale2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Scale2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.9999 13.2V18M5.9999 18H10.4765M5.9999 18L11.3332 12.6667M21.5999 10.8H15.5999C14.2744 10.8 13.1999 9.72551 13.1999 8.40002V2.40002M4.53324 21.6H19.4666C20.6448 21.6 21.5999 20.6449 21.5999 19.4667V4.53336C21.5999 3.35515 20.6448 2.40002 19.4666 2.40002H4.53324C3.35503 2.40002 2.3999 3.35515 2.3999 4.53336V19.4667C2.3999 20.6449 3.35503 21.6 4.53324 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Scale2 = memo(Scale2Inner)
Scale2.displayName = 'Scale2'