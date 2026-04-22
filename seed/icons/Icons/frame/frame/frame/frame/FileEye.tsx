import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileEyeInner = forwardRef<SVGSVGElement, IconProps>(
  function FileEye({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.3998 21.6001H5.39975C4.07426 21.6001 2.99975 20.5256 2.99976 19.2001L2.99985 4.80013C2.99986 3.47466 4.07437 2.40015 5.39985 2.40015H16.2001C17.5256 2.40015 18.6001 3.47466 18.6001 4.80015V9.60015M16.8001 16.1401V16.077M21.0001 16.1912C21.0001 16.1912 20.004 19.1308 16.8001 19.0795C13.5963 19.0281 12.6001 16.1912 12.6001 16.1912C12.6001 16.1912 13.5559 13.2001 16.8001 13.2001C20.0444 13.2001 21.0001 16.1912 21.0001 16.1912Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileEye = memo(FileEyeInner)
FileEye.displayName = 'FileEye'