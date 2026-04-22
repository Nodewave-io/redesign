import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Maximise2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Maximise2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.7999 2.40002H4.53324C3.35503 2.40002 2.3999 3.35515 2.3999 4.53336V8.80002M8.7999 21.6H4.53324C3.35503 21.6 2.3999 20.6449 2.3999 19.4667V15.2M15.1999 2.40002H19.4666C20.6448 2.40002 21.5999 3.35515 21.5999 4.53336V8.80002M21.5999 15.2V19.4667C21.5999 20.6449 20.6448 21.6 19.4666 21.6H15.1999" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Maximise2 = memo(Maximise2Inner)
Maximise2.displayName = 'Maximise2'