import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MessageChat2Inner = forwardRef<SVGSVGElement, IconProps>(
  function MessageChat2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.99983 11C4.99983 6.58172 8.58125 3 12.9992 3C17.4171 3 20.9985 6.58172 20.9985 11C20.9985 12.15 20.7558 13.2434 20.319 14.2316L21 18.9992L16.9146 17.9778C15.7572 18.6287 14.4215 19 12.9992 19M3.00095 16C3.00095 16.7188 3.15258 17.4021 3.4256 18.0198L3 20.9995L5.55315 20.3611C6.27643 20.768 7.11115 21 8.00005 21C10.761 21 12.9992 18.7614 12.9992 16C12.9992 13.2386 10.761 11 8.00005 11C5.23912 11 3.00095 13.2386 3.00095 16Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MessageChat2 = memo(MessageChat2Inner)
MessageChat2.displayName = 'MessageChat2'