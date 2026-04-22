import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileInner = forwardRef<SVGSVGElement, IconProps>(
  function File({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.1667 3V7.5C13.1667 8.12132 13.689 8.625 14.3333 8.625H19M13.3668 3H7.33333C6.04467 3 5 4.00736 5 5.25V18.75C5 19.9926 6.04467 21 7.33333 21H16.6667C17.9553 21 19 19.9926 19 18.75V8.43198C19 7.83524 18.7542 7.26295 18.3166 6.84099L15.0168 3.65901C14.5792 3.23705 13.9857 3 13.3668 3Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const File = memo(FileInner)
File.displayName = 'File'