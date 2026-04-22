import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Download3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Download3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4 15.2044L4 18.8925C4 19.4514 4.21071 19.9875 4.58579 20.3827C4.96086 20.778 5.46957 21 6 21H18C18.5304 21 19.0391 20.778 19.4142 20.3827C19.7893 19.9875 20 19.4514 20 18.8925V15.2044M12.0011 3V14.9425M12.0011 14.9425L16.5725 10.3793M12.0011 14.9425L7.42969 10.3793" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Download3 = memo(Download3Inner)
Download3.displayName = 'Download3'