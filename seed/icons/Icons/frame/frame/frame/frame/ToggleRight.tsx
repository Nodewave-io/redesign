import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ToggleRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ToggleRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.25 16.25H7.75C5.40279 16.25 3.5 14.3472 3.5 12C3.5 9.65279 5.40279 7.75 7.75 7.75H16.25M16.25 16.25C18.5972 16.25 20.5 14.3472 20.5 12C20.5 9.65279 18.5972 7.75 16.25 7.75M16.25 16.25C13.9028 16.25 12 14.3472 12 12C12 9.65279 13.9028 7.75 16.25 7.75" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const ToggleRight = memo(ToggleRightInner)
ToggleRight.displayName = 'ToggleRight'