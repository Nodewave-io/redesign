import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function FileCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.89971 21.6001H5.0997C3.77421 21.6001 2.6997 20.5256 2.69971 19.2001L2.6998 4.80013C2.69981 3.47466 3.77432 2.40015 5.0998 2.40015H15.9001C17.2255 2.40015 18.3001 3.47466 18.3001 4.80015V11.4001M13.5001 18.2001L15.7001 20.4001L21.3001 14.4001" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileCheck = memo(FileCheckInner)
FileCheck.displayName = 'FileCheck'