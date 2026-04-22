import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PercentInner = forwardRef<SVGSVGElement, IconProps>(
  function Percent({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20 20L4 4.06488M8.81929 17.4632C8.81929 18.7753 7.75126 19.839 6.43376 19.839C5.11627 19.839 4.04824 18.7753 4.04824 17.4632C4.04824 16.151 5.11627 15.0873 6.43376 15.0873C7.75126 15.0873 8.81929 16.151 8.81929 17.4632ZM19.9518 6.37586C19.9518 7.68801 18.8837 8.75171 17.5662 8.75171C16.2487 8.75171 15.1807 7.68801 15.1807 6.37586C15.1807 5.06371 16.2487 4 17.5662 4C18.8837 4 19.9518 5.06371 19.9518 6.37586Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Percent = memo(PercentInner)
Percent.displayName = 'Percent'