import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileReturnInner = forwardRef<SVGSVGElement, IconProps>(
  function FileReturn({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.8998 21.6001H5.69979C4.37431 21.6001 3.2998 20.5256 3.2998 19.2001L3.2999 4.80013C3.29991 3.47466 4.37442 2.40015 5.6999 2.40015H16.5002C17.8256 2.40015 18.9002 3.47466 18.9002 4.80015V10.2001M14.1428 20.4001L11.7002 17.9459M11.7002 17.9459L14.0323 15.6001M11.7002 17.9459H18.9273C19.9064 17.9459 20.7002 17.1521 20.7002 16.173C20.7002 15.1939 19.9064 14.4001 18.9273 14.4001H16.5002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileReturn = memo(FileReturnInner)
FileReturn.displayName = 'FileReturn'