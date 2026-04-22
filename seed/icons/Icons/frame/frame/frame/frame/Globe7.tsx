import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Globe7Inner = forwardRef<SVGSVGElement, IconProps>(
  function Globe7({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.52197 17.4L4.68788 16.1533C6.36055 17.8467 8.68373 18.5065 11.252 18.5065C16.3474 18.5065 20.478 14.3759 20.478 9.28057C20.478 6.75349 19.462 4.46372 17.8161 2.79745L18.9817 1.80005M11.7505 18.5065V22.2M11.7505 22.2H6.26483M11.7505 22.2H16.9869M16.722 9.00005C16.722 12.3138 14.0357 15 10.722 15C7.40826 15 4.72197 12.3138 4.72197 9.00005C4.72197 5.68634 7.40826 3.00005 10.722 3.00005C14.0357 3.00005 16.722 5.68634 16.722 9.00005Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Globe7 = memo(Globe7Inner)
Globe7.displayName = 'Globe7'