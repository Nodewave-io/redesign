import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const NotificationSquareInner = forwardRef<SVGSVGElement, IconProps>(
  function NotificationSquare({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.4374 3H5.24997C4.00735 3 3 4.00734 3 5.24996V14.2502C3 15.4928 4.00736 16.5002 5.24999 16.5002L13.369 16.5001L17.625 21V16.5002L18.7501 16.5001C19.9927 16.5001 21 15.4928 21 14.2502V12.0004M21 5.81274C21 7.36601 19.7408 8.62519 18.1875 8.62519C16.6343 8.62519 15.3751 7.36601 15.3751 5.81274C15.3751 4.25946 16.6343 3.00028 18.1875 3.00028C19.7408 3.00028 21 4.25946 21 5.81274Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const NotificationSquare = memo(NotificationSquareInner)
NotificationSquare.displayName = 'NotificationSquare'