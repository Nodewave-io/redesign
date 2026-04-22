import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileDownInner = forwardRef<SVGSVGElement, IconProps>(
  function FileDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7999 21.5998H5.99984C4.67436 21.5998 3.59984 20.5253 3.59985 19.1998L3.59995 4.79989C3.59995 3.47441 4.67447 2.3999 5.99995 2.3999H16.8002C18.1257 2.3999 19.2002 3.47442 19.2002 4.7999V11.3999M20.4002 19.1573L17.946 21.5999M17.946 21.5999L15.6002 19.2677M17.946 21.5999V15.5999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileDown = memo(FileDownInner)
FileDown.displayName = 'FileDown'