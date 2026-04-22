import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const File2Inner = forwardRef<SVGSVGElement, IconProps>(
  function File2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.8 2.3999H6.5998C5.27432 2.3999 4.19981 3.47441 4.1998 4.79989L4.19971 19.1998C4.1997 20.5253 5.27421 21.5998 6.5997 21.5998L17.3997 21.5999C18.7252 21.5999 19.7997 20.5254 19.7998 19.2L19.8 4.39994C19.8001 3.29536 18.9046 2.3999 17.8 2.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const File2 = memo(File2Inner)
File2.displayName = 'File2'