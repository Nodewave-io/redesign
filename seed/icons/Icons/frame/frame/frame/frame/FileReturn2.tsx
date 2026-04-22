import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileReturn2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FileReturn2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.4999 21.6001H4.49984C3.17436 21.6001 2.09984 20.5256 2.09985 19.2001L2.09995 4.80013C2.09995 3.47466 3.17447 2.40015 4.49995 2.40015H15.3002C16.6257 2.40015 17.7002 3.47466 17.7002 4.80015V9.60015M6.30023 7.20015H13.5002M6.30023 10.8001H13.5002M6.30023 14.4001H9.90023M15.3428 20.4001L12.9002 17.9459M12.9002 17.9459L15.2324 15.6001M12.9002 17.9459H20.1274C21.1065 17.9459 21.9002 17.1521 21.9002 16.173C21.9002 15.1939 21.1065 14.4001 20.1274 14.4001H17.7002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileReturn2 = memo(FileReturn2Inner)
FileReturn2.displayName = 'FileReturn2'