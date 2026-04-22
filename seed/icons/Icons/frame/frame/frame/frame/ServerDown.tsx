import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ServerDownInner = forwardRef<SVGSVGElement, IconProps>(
  function ServerDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.3997 16.8H11.3997M6.59975 16.8903V16.8M14.3997 5.95745L11.9455 8.40002M11.9455 8.40002L9.59975 6.06786M11.9455 8.40002V2.40002M16.8001 12H7.1999C4.54887 12 2.39982 14.1492 2.3999 16.8002C2.39999 19.4511 4.549 21.6 7.1999 21.6H16.8001C19.451 21.6 21.6001 19.451 21.6001 16.8C21.6001 14.1491 19.451 12 16.8001 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ServerDown = memo(ServerDownInner)
ServerDown.displayName = 'ServerDown'