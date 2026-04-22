import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const VolumeInner = forwardRef<SVGSVGElement, IconProps>(
  function Volume({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21 21L17.625 18L21 15.0012L17.625 12L21 9.00004L17.625 6.00006L21 3M12.0161 5.92882L7.64072 9.50821H3V14.6616L7.64072 14.6603L12.0161 18.2409V5.92882Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Volume = memo(VolumeInner)
Volume.displayName = 'Volume'