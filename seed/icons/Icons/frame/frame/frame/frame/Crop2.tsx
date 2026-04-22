import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Crop2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Crop2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 6.60824H6.87113M6.87113 6.60824V2.40002M6.87113 6.60824V15.5507C6.87113 16.1317 7.34216 16.6028 7.92319 16.6028H17.6547M6.87113 6.60824L16.6026 6.54689C17.1837 6.54689 17.6547 7.01792 17.6547 7.59895V16.6028M17.6547 16.6028H21.5999M17.6547 16.6028V21.863" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Crop2 = memo(Crop2Inner)
Crop2.displayName = 'Crop2'