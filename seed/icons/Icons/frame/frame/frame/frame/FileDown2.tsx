import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileDown2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FileDown2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7999 21.5998H5.99984C4.67436 21.5998 3.59984 20.5253 3.59985 19.1998L3.59995 4.79989C3.59995 3.47441 4.67447 2.3999 5.99995 2.3999H16.8002C18.1257 2.3999 19.2002 3.47442 19.2002 4.7999V11.3999M20.4002 19.1573L17.946 21.5999M17.946 21.5999L15.6002 19.2677M17.946 21.5999V15.5999M7.80023 7.1999H15.0002M7.80023 10.7999H15.0002M7.80023 14.3999H11.4002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileDown2 = memo(FileDown2Inner)
FileDown2.displayName = 'FileDown2'