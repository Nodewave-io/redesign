import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileShield3Inner = forwardRef<SVGSVGElement, IconProps>(
  function FileShield3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.19995 5.9999V17.9999C4.19995 19.9881 5.81173 21.5999 7.79995 21.5999H16.2C18.1882 21.5999 19.8 19.9881 19.8 17.9999V5.9999C19.8 4.01168 18.1882 2.3999 16.2 2.3999H7.79995C5.81173 2.3999 4.19995 4.01168 4.19995 5.9999Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M13.6099 8.60469C12.5964 8.09794 11.4035 8.09794 10.39 8.60469L8.99995 9.2997V12.6447C8.99995 13.5497 10.0676 14.5794 12 15.7997C13.9323 14.5794 15 13.7997 15 12.6447C15 11.4897 15 9.2997 15 9.2997L13.6099 8.60469Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileShield3 = memo(FileShield3Inner)
FileShield3.displayName = 'FileShield3'