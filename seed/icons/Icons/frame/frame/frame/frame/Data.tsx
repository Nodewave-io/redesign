import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DataInner = forwardRef<SVGSVGElement, IconProps>(
  function Data({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.2399 12C6.2399 13.0604 5.38029 13.92 4.3199 13.92C3.25952 13.92 2.3999 13.0604 2.3999 12C2.3999 10.9396 3.25952 10.08 4.3199 10.08C5.38029 10.08 6.2399 10.9396 6.2399 12ZM6.2399 12H17.7599M17.7599 12C17.7599 13.0604 18.6195 13.92 19.6799 13.92C20.7403 13.92 21.5999 13.0604 21.5999 12C21.5999 10.9396 20.7403 10.08 19.6799 10.08C18.6195 10.08 17.7599 10.9396 17.7599 12ZM17.7599 4.32002C17.7599 5.38041 18.6195 6.24002 19.6799 6.24002C20.7403 6.24002 21.5999 5.38041 21.5999 4.32002C21.5999 3.25964 20.7403 2.40002 19.6799 2.40002C18.6195 2.40002 17.7599 3.25964 17.7599 4.32002ZM17.7599 4.32002H12.2399C11.7097 4.32002 11.2799 4.74983 11.2799 5.28002V18.72C11.2799 19.2502 11.7097 19.68 12.2399 19.68H17.7599M17.7599 19.68C17.7599 20.7404 18.6195 21.6 19.6799 21.6C20.7403 21.6 21.5999 20.7404 21.5999 19.68C21.5999 18.6196 20.7403 17.76 19.6799 17.76C18.6195 17.76 17.7599 18.6196 17.7599 19.68Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Data = memo(DataInner)
Data.displayName = 'Data'