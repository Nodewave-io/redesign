import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SunUpInner = forwardRef<SVGSVGElement, IconProps>(
  function SunUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 21.0667H21.5999M2.3999 17.3333H5.06657M4.53324 10.4L6.41885 12.2856M18.6857 10.4L16.8001 12.2856M18.9332 17.3333H21.5999M11.9999 10.4V2.93335M11.9999 2.93335L8.7999 6.13335M11.9999 2.93335L15.1999 6.13335M8.26657 17.3333C8.26657 15.2715 9.93804 13.6 11.9999 13.6C14.0618 13.6 15.7332 15.2715 15.7332 17.3333" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const SunUp = memo(SunUpInner)
SunUp.displayName = 'SunUp'