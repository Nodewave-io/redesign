import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LightningCircleContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function LightningCircleContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7.5 13.5L12.75 6.375V11.25H16.5L11.25 17.625V13.5H7.5Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LightningCircleContained = memo(LightningCircleContainedInner)
LightningCircleContained.displayName = 'LightningCircleContained'