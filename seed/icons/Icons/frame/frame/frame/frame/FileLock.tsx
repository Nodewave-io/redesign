import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileLockInner = forwardRef<SVGSVGElement, IconProps>(
  function FileLock({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.6001 21.5999H7.2001C5.21187 21.5999 3.6001 19.9881 3.6001 17.9999V5.9999C3.6001 4.01168 5.21187 2.3999 7.2001 2.3999H15.6001C17.5883 2.3999 19.2001 4.01168 19.2001 5.9999V8.9999M15.0001 14.9999V13.7999C15.0001 12.8058 15.806 11.9999 16.8001 11.9999C17.7942 11.9999 18.6001 12.8058 18.6001 13.7999V15.5999M14.4001 21.5999H19.2001C19.8628 21.5999 20.4001 21.0626 20.4001 20.3999V16.7999C20.4001 16.1372 19.8628 15.5999 19.2001 15.5999H14.4001C13.7374 15.5999 13.2001 16.1372 13.2001 16.7999V20.3999C13.2001 21.0626 13.7374 21.5999 14.4001 21.5999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileLock = memo(FileLockInner)
FileLock.displayName = 'FileLock'