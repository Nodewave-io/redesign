import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Scale3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Scale3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.9999 10.8V6.00002M17.9999 6.00002L13.5233 6.00002M17.9999 6.00002L12.6666 11.3334M2.3999 13.2H8.3999C9.72539 13.2 10.7999 14.2745 10.7999 15.6L10.7999 21.6M19.4666 2.40003L4.53324 2.40002C3.35503 2.40002 2.3999 3.35515 2.3999 4.53336L2.3999 19.4667C2.3999 20.6449 3.35503 21.6 4.53324 21.6L19.4666 21.6C20.6448 21.6 21.5999 20.6449 21.5999 19.4667L21.5999 4.53336C21.5999 3.35515 20.6448 2.40003 19.4666 2.40003Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Scale3 = memo(Scale3Inner)
Scale3.displayName = 'Scale3'