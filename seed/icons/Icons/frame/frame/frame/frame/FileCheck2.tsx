import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileCheck2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FileCheck2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.2999 21.6001H5.49984C4.17436 21.6001 3.09984 20.5256 3.09985 19.2001L3.09995 4.80013C3.09995 3.47466 4.17447 2.40015 5.49995 2.40015H16.3002C17.6257 2.40015 18.7002 3.47466 18.7002 4.80015V11.4001M13.9002 18.2001L16.1002 20.4001L20.9002 15.6M7.30023 7.20015H14.5002M7.30023 10.8001H14.5002M7.30023 14.4001H10.9002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileCheck2 = memo(FileCheck2Inner)
FileCheck2.displayName = 'FileCheck2'