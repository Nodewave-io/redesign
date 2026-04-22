import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PackageMinusInner = forwardRef<SVGSVGElement, IconProps>(
  function PackageMinus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.6707 7.20002L11.3568 2.40002L3.04297 7.20002V16.8L11.3568 21.6M19.6707 7.20002L11.3568 12.6M19.6707 7.20002V12M11.3568 21.6V12.6M11.3568 21.6L13.1563 20.5611M11.3568 12.6L3.55681 7.80002M14.9568 9.60002L7.15681 4.80002M15.5568 16.8H20.9568" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const PackageMinus = memo(PackageMinusInner)
PackageMinus.displayName = 'PackageMinus'