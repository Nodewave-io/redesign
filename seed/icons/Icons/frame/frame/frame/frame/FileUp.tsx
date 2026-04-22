import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FileUpInner = forwardRef<SVGSVGElement, IconProps>(
  function FileUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.7999 21.5998H5.99984C4.67436 21.5998 3.59984 20.5253 3.59985 19.1998L3.59995 4.79989C3.59995 3.47441 4.67447 2.3999 5.99995 2.3999H16.8002C18.1257 2.3999 19.2002 3.47442 19.2002 4.7999V11.3999M15.6002 18.0425L18.0545 15.5999M18.0545 15.5999L20.4002 17.9321M18.0545 15.5999V21.5999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FileUp = memo(FileUpInner)
FileUp.displayName = 'FileUp'