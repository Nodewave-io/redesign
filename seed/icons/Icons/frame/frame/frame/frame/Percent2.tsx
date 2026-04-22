import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Percent2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Percent2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21 12.0625L3 12.0625M13.2781 16.8239C14.0192 17.5504 14.0192 18.7285 13.2781 19.4551C12.537 20.1816 11.3355 20.1816 10.5944 19.4551C9.85328 18.7285 9.85328 17.5504 10.5944 16.8239C11.3355 16.0973 12.537 16.0973 13.2781 16.8239ZM13.2781 4.54494C14.0192 5.27152 14.0192 6.44955 13.2781 7.17614C12.537 7.90272 11.3355 7.90272 10.5944 7.17614C9.85328 6.44955 9.85328 5.27152 10.5944 4.54494C11.3355 3.81835 12.537 3.81835 13.2781 4.54494Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Percent2 = memo(Percent2Inner)
Percent2.displayName = 'Percent2'