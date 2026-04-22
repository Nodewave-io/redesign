import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Shield2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Shield2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.3417 3.07072C12.4971 2.64843 11.503 2.64843 10.6584 3.07072L4.80005 5.9999V14.0279C4.80005 16.1999 7.36245 18.6711 12 21.5999C16.6377 18.6711 19.2001 16.7999 19.2001 14.0279C19.2001 11.2559 19.2001 5.9999 19.2001 5.9999L13.3417 3.07072Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Shield2 = memo(Shield2Inner)
Shield2.displayName = 'Shield2'