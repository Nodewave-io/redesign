import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PackagePlusInner = forwardRef<SVGSVGElement, IconProps>(
  function PackagePlus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.8213 7.20002L11.5074 2.40002L3.1936 7.20002V16.8L11.5074 21.6M19.8213 7.20002L11.5074 12.6M19.8213 7.20002V12M11.5074 21.6V12.6M11.5074 21.6L13.3069 20.5611M11.5074 12.6L3.70745 7.80002M15.1074 9.60002L7.30745 4.80002M15.4064 17.7H18.1068M18.1068 17.7H20.8064M18.1068 17.7L18.1068 15M18.1068 17.7V20.4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const PackagePlus = memo(PackagePlusInner)
PackagePlus.displayName = 'PackagePlus'