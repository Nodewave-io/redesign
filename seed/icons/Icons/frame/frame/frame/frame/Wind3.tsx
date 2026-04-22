import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Wind3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Wind3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.41679 20.8185C8.68581 21.0856 10.2612 21.2438 11.9679 21.2438C13.8033 21.2438 15.4869 21.0608 16.8008 20.7562M3.88411 12.2614C5.59116 13.2409 8.57402 13.8899 11.9683 13.8899C15.3626 13.8899 18.3455 13.2409 20.0525 12.2614M5.3999 16.5561C6.78688 17.1639 9.21045 17.5666 11.9683 17.5666C14.7262 17.5666 17.1498 17.1639 18.5367 16.5561M21.5999 6.29295C21.5999 8.24629 17.3018 9.82979 11.9999 9.82979C6.69797 9.82979 2.3999 8.24629 2.3999 6.29295C2.3999 4.3396 6.69797 2.7561 11.9999 2.7561C17.3018 2.7561 21.5999 4.3396 21.5999 6.29295Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Wind3 = memo(Wind3Inner)
Wind3.displayName = 'Wind3'