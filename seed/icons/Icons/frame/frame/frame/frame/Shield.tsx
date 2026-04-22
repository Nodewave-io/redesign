import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ShieldInner = forwardRef<SVGSVGElement, IconProps>(
  function Shield({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 2.3999C9.30325 4.6927 7.61285 4.7999 4.80005 4.7999V14.0279C4.80005 17.7103 7.36245 18.6711 12 21.5999C16.6376 18.6711 19.2001 17.7103 19.2001 14.0279C19.2001 10.3455 19.2001 4.7999 19.2001 4.7999C16.3872 4.7999 14.6968 4.6927 12 2.3999Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Shield = memo(ShieldInner)
Shield.displayName = 'Shield'