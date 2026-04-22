import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Cursor3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Cursor3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.5217 21.3645L21.3644 18.5219C21.6784 18.2079 21.6784 17.6988 21.3644 17.3848L16.8828 12.9032C16.5439 12.5643 16.5749 12.0062 16.9491 11.7068L20.7167 8.69273C21.2266 8.28477 21.0632 7.4712 20.4353 7.29179L3.4258 2.43195C2.81928 2.25865 2.25853 2.8194 2.43182 3.42592L7.29167 20.4354C7.47108 21.0633 8.28464 21.2267 8.6926 20.7168L11.7067 16.9492C12.006 16.575 12.5642 16.5441 12.9031 16.8829L17.3847 21.3645C17.6987 21.6785 18.2077 21.6785 18.5217 21.3645Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Cursor3 = memo(Cursor3Inner)
Cursor3.displayName = 'Cursor3'