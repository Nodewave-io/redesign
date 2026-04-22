import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Package2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Package2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 16.0955V12.5998M12 12.5998L7.79998 10.1998M12 12.5998L16.2 10.1998M11.9999 2.40002L20.3137 7.20002V16.8L11.9999 21.6L3.68604 16.8V7.20002L11.9999 2.40002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Package2 = memo(Package2Inner)
Package2.displayName = 'Package2'