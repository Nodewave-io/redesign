import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BankNoteInner = forwardRef<SVGSVGElement, IconProps>(
  function BankNote({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 7.8C2.3999 6.80589 3.20579 6 4.1999 6H19.7999C20.794 6 21.5999 6.80589 21.5999 7.8V16.2C21.5999 17.1941 20.794 18 19.7999 18H4.1999C3.20579 18 2.3999 17.1941 2.3999 16.2V7.8Z" stroke={color} strokeWidth="2"/>
        <path d="M14.3999 12C14.3999 13.3255 13.3254 14.4 11.9999 14.4C10.6744 14.4 9.5999 13.3255 9.5999 12C9.5999 10.6745 10.6744 9.6 11.9999 9.6C13.3254 9.6 14.3999 10.6745 14.3999 12Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const BankNote = memo(BankNoteInner)
BankNote.displayName = 'BankNote'