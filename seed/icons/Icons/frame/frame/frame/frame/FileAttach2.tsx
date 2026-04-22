import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileAttach2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FileAttach2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7997 21.6001H6.5997C5.27421 21.6001 4.1997 20.5256 4.19971 19.2001L4.1998 4.80013C4.19981 3.47466 5.27432 2.40015 6.5998 2.40015H17.4001C18.7256 2.40015 19.8001 3.47466 19.8001 4.80015V10.2001M13.8001 15.5543V18.4987C13.8001 19.9537 15.3515 21.2881 16.8065 21.2881C18.2614 21.2881 19.8001 19.9537 19.8001 18.4987V14.7795C19.8001 14.0092 19.3573 13.2275 18.3723 13.2275C17.3185 13.2275 16.8065 14.0092 16.8065 14.7795V18.3437" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const FileAttach2 = memo(FileAttach2Inner)
FileAttach2.displayName = 'FileAttach2'