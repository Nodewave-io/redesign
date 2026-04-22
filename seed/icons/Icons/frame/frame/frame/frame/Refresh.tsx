import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const RefreshInner = forwardRef<SVGSVGElement, IconProps>(
  function Refresh({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.9999 19.2C4.01168 19.2 2.3999 17.5882 2.3999 15.6V8.3999C2.3999 6.41168 4.01168 4.7999 5.9999 4.7999H11.3999M16.1999 4.7999H17.9999C19.9881 4.7999 21.5999 6.41168 21.5999 8.3999V15.6C21.5999 17.5882 19.9881 19.2 17.9999 19.2H10.1999M10.1999 19.2L12.5999 16.7999M10.1999 19.2L12.5999 21.5999M10.1999 7.1999L12.5999 4.7999L10.1999 2.3999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Refresh = memo(RefreshInner)
Refresh.displayName = 'Refresh'