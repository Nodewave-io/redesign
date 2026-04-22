import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PackageCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function PackageCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.6707 7.20002L11.3568 2.40002L3.04297 7.20002V16.8L11.3568 21.6M19.6707 7.20002L11.3568 12.6M19.6707 7.20002V12M11.3568 21.6V12.6M11.3568 21.6L13.1562 20.5611M11.3568 12.6L3.55681 7.80002M14.9568 9.60002L7.15681 4.80002M16.1568 18L17.3568 19.2L20.9568 15.6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const PackageCheck = memo(PackageCheckInner)
PackageCheck.displayName = 'PackageCheck'