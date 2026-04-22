import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Volume7Inner = forwardRef<SVGSVGElement, IconProps>(
  function Volume7({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.8827 8.5V4L12.2315 8.65121L5.5 8.65121V15.3481H9.54584M16.8827 13V20L13 16.1173M6 18.5L9.54584 15.3481M19.5 6.5L9.54584 15.3481" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Volume7 = memo(Volume7Inner)
Volume7.displayName = 'Volume7'