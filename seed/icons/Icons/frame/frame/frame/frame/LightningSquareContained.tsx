import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LightningSquareContainedInner = forwardRef<SVGSVGElement, IconProps>(
  function LightningSquareContained({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.375 21C4.51104 21 3 19.489 3 17.625V6.37498C3 4.51103 4.51104 3 6.375 3H17.625C19.489 3 21 4.51103 21 6.37498L21 17.625C21 19.489 19.489 21 17.625 21H6.375Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7.5 13.4999L12.75 6.37498V11.25H16.5L11.25 17.6249V13.4999H7.5Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LightningSquareContained = memo(LightningSquareContainedInner)
LightningSquareContained.displayName = 'LightningSquareContained'