import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CropInner = forwardRef<SVGSVGElement, IconProps>(
  function Crop({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 6.60824H6.87113M6.87113 2.40002V15.5507C6.87113 16.1317 7.34216 16.6028 7.92319 16.6028H21.5999M17.6547 21.863V16.8658M17.3917 13.4466V7.6603C17.3917 7.07926 16.9207 6.60824 16.3396 6.60824H10.8163" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Crop = memo(CropInner)
Crop.displayName = 'Crop'