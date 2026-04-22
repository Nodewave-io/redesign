import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DotHorizontalInner = forwardRef<SVGSVGElement, IconProps>(
  function DotHorizontal({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.1999 12.0001C7.1999 13.3256 6.12539 14.4001 4.7999 14.4001C3.47442 14.4001 2.3999 13.3256 2.3999 12.0001C2.3999 10.6746 3.47442 9.6001 4.7999 9.6001C6.12539 9.6001 7.1999 10.6746 7.1999 12.0001Z" stroke={color} strokeWidth="2"/>
        <path d="M14.3999 12.0001C14.3999 13.3256 13.3254 14.4001 11.9999 14.4001C10.6744 14.4001 9.5999 13.3256 9.5999 12.0001C9.5999 10.6746 10.6744 9.6001 11.9999 9.6001C13.3254 9.6001 14.3999 10.6746 14.3999 12.0001Z" stroke={color} strokeWidth="2"/>
        <path d="M21.5999 12.0001C21.5999 13.3256 20.5254 14.4001 19.1999 14.4001C17.8744 14.4001 16.7999 13.3256 16.7999 12.0001C16.7999 10.6746 17.8744 9.6001 19.1999 9.6001C20.5254 9.6001 21.5999 10.6746 21.5999 12.0001Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const DotHorizontal = memo(DotHorizontalInner)
DotHorizontal.displayName = 'DotHorizontal'