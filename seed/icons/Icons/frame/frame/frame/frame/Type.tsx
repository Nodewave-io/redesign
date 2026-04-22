import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TypeInner = forwardRef<SVGSVGElement, IconProps>(
  function Type({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 20.4706H5.78814M13.694 20.4706H21.5999M5.6752 14.8236H13.4681M9.40225 4.99767L15.9528 20.4706M3.52931 20.4706L10.3058 2.40002H12.5646L20.4705 20.4706" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Type = memo(TypeInner)
Type.displayName = 'Type'