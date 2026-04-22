import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileMinusInner = forwardRef<SVGSVGElement, IconProps>(
  function FileMinus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.6058 21.6001H5.6058C4.28031 21.6001 3.2058 20.5256 3.20581 19.2001L3.2059 4.80013C3.20591 3.47466 4.28043 2.40015 5.6059 2.40015H16.4062C17.7317 2.40015 18.8062 3.47466 18.8062 4.80015V13.2001M14.0058 17.7943H20.794" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileMinus = memo(FileMinusInner)
FileMinus.displayName = 'FileMinus'