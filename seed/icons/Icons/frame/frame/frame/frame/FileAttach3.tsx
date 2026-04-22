import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileAttach3Inner = forwardRef<SVGSVGElement, IconProps>(
  function FileAttach3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.70101 9.91755V13.6058C8.70101 15.4283 10.1785 16.9058 12.001 16.9058C13.8236 16.9058 15.301 15.4283 15.301 13.6058V8.94696C15.301 7.98209 14.5188 7.1999 13.554 7.1999C12.5891 7.1999 11.8069 7.98209 11.8069 8.94696V13.4117M6.60004 2.3999H17.4003C18.7258 2.3999 19.8003 3.47445 19.8003 4.79995L19.8 19.2C19.8 20.5254 18.7254 21.5999 17.4 21.5999L6.59994 21.5998C5.27446 21.5998 4.19994 20.5253 4.19995 19.1998L4.20004 4.79989C4.20005 3.47441 5.27457 2.3999 6.60004 2.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const FileAttach3 = memo(FileAttach3Inner)
FileAttach3.displayName = 'FileAttach3'