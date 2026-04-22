import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const InboxInner = forwardRef<SVGSVGElement, IconProps>(
  function Inbox({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 14.25H7.5L9 15.825H15L16.5 14.25H21M5.25 21C4.00736 21 3 19.9926 3 18.75V5.25C3 4.00736 4.00736 3 5.25 3H18.75C19.9926 3 21 4.00736 21 5.25V18.75C21 19.9926 19.9926 21 18.75 21H5.25Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Inbox = memo(InboxInner)
Inbox.displayName = 'Inbox'