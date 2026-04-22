import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Data4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Data4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 17.4V11.4M19.6799 17.76C18.6195 17.76 17.7599 18.6196 17.7599 19.68C17.7599 20.7404 18.6195 21.6 19.6799 21.6C20.7403 21.6 21.5999 20.7404 21.5999 19.68C21.5999 18.6196 20.7403 17.76 19.6799 17.76ZM19.6799 17.76L19.6799 12.24C19.6799 11.7098 19.2501 11.28 18.7199 11.28H5.2799C4.74971 11.28 4.3199 11.7098 4.3199 12.24L4.3199 17.76M4.3199 17.76C3.25951 17.76 2.3999 18.6196 2.3999 19.68C2.3999 20.7404 3.25951 21.6 4.3199 21.6C5.38029 21.6 6.2399 20.7404 6.2399 19.68C6.2399 18.6196 5.38029 17.76 4.3199 17.76ZM11.9999 21.6C10.9395 21.6 10.0799 20.7404 10.0799 19.68C10.0799 18.6196 10.9395 17.76 11.9999 17.76C13.0603 17.76 13.9199 18.6196 13.9199 19.68C13.9199 20.7404 13.0603 21.6 11.9999 21.6ZM5.9999 7.20002H17.9999C18.6626 7.20002 19.1999 6.66277 19.1999 6.00002V3.60002C19.1999 2.93728 18.6626 2.40002 17.9999 2.40002H5.9999C5.33716 2.40002 4.7999 2.93728 4.7999 3.60002V6.00002C4.7999 6.66277 5.33716 7.20002 5.9999 7.20002Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Data4 = memo(Data4Inner)
Data4.displayName = 'Data4'