import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Feather2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Feather2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.17533 19.1281L15.3577 8.94581M13.6606 16.9462L18.7518 11.8551C20.4924 10.1144 20.4924 7.29232 18.7518 5.5517C17.0112 3.81108 14.189 3.81108 12.4484 5.5517L7.35725 10.6429L7.35725 16.9462L13.6606 16.9462Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Feather2 = memo(Feather2Inner)
Feather2.displayName = 'Feather2'