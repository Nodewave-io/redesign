import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PackageInner = forwardRef<SVGSVGElement, IconProps>(
  function Package({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 21.6L20.3137 16.8V7.20002L11.9999 2.40002L3.68604 7.20002V16.8L11.9999 21.6ZM11.9999 21.6V12.6M11.9999 12.6L4.19988 7.80002M11.9999 12.6L19.7999 7.80002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Package = memo(PackageInner)
Package.displayName = 'Package'