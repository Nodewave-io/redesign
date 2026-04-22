import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 26) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Target6Inner = forwardRef<SVGSVGElement, IconProps>(
  function Target6({ size = 26, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 26 26" fill={color} {...props}>
        <path d="M9.65186 3.99993C10.6943 3.61196 11.8224 3.39993 13 3.39993C18.3019 3.39993 22.6 7.698 22.6 12.9999C22.6 14.273 22.3522 15.4882 21.9022 16.5999M16 22.1219C15.0561 22.4321 14.0477 22.5999 13 22.5999C7.69806 22.5999 3.4 18.3019 3.4 12.9999C3.4 11.7268 3.64781 10.5116 4.09782 9.39993M13 5.8V1M13 25V20.2M20.2 13H25M1 13H5.8M4.6 4L21.4 22.6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Target6 = memo(Target6Inner)
Target6.displayName = 'Target6'