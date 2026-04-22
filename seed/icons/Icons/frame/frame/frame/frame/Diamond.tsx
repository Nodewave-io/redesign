import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DiamondInner = forwardRef<SVGSVGElement, IconProps>(
  function Diamond({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.5086 3.83008L8.45815 9.1427L11.9999 20.1699M11.9999 20.1699L15.6349 9.0495L13.6776 3.83008M11.9999 20.1699L2.3999 9.2359M11.9999 20.1699L21.5999 9.2359M2.3999 9.2359L6.50087 3.83008H17.5921L21.5999 9.2359M2.3999 9.2359H21.5999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Diamond = memo(DiamondInner)
Diamond.displayName = 'Diamond'