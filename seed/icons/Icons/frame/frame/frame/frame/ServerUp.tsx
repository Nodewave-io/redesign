import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ServerUpInner = forwardRef<SVGSVGElement, IconProps>(
  function ServerUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.3997 16.8H11.3997M6.59975 16.8903V16.8M9.59975 4.8426L12.054 2.40002M12.054 2.40002L14.3997 4.73219M12.054 2.40002V8.40002M16.8001 12H7.1999C4.54887 12 2.39982 14.1492 2.3999 16.8002C2.39999 19.4511 4.549 21.6 7.1999 21.6H16.8001C19.451 21.6 21.6001 19.451 21.6001 16.8C21.6001 14.1491 19.451 12 16.8001 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ServerUp = memo(ServerUpInner)
ServerUp.displayName = 'ServerUp'