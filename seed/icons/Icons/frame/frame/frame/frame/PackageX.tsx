import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PackageXInner = forwardRef<SVGSVGElement, IconProps>(
  function PackageX({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.1619 7.20002L11.848 2.40002L3.53418 7.20002V16.8L11.848 21.6M20.1619 7.20002L11.848 12.6M20.1619 7.20002V12M11.848 21.6V12.6M11.848 21.6L13.6475 20.5611M11.848 12.6L4.04802 7.80002M15.448 9.60002L7.64802 4.80002M16.647 15.3812L18.5565 17.2906M18.5565 17.2906L20.4654 19.1995M18.5565 17.2906L20.4657 15.3814M18.5565 17.2906L16.6473 19.1998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const PackageX = memo(PackageXInner)
PackageX.displayName = 'PackageX'