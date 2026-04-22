import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MoonInner = forwardRef<SVGSVGElement, IconProps>(
  function Moon({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.6001 14.6396C20.6978 14.9132 19.7405 15.0603 18.7488 15.0603C13.3308 15.0603 8.93868 10.6682 8.93868 5.25018C8.93868 4.25896 9.08569 3.30208 9.35909 2.40015C5.33166 3.62153 2.40015 7.36319 2.40015 11.7895C2.40015 17.2075 6.7923 21.5997 12.2103 21.5997C16.6371 21.5997 20.379 18.6676 21.6001 14.6396Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Moon = memo(MoonInner)
Moon.displayName = 'Moon'