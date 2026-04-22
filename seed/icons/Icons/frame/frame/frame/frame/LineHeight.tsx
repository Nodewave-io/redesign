import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LineHeightInner = forwardRef<SVGSVGElement, IconProps>(
  function LineHeight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 8.38824L6.38823 5M6.38823 5L9.77647 8.38824M6.38823 5V20.8118M3 17.4235L6.38823 20.8118M6.38823 20.8118L9.77647 17.4235M14.2941 6.12941H22.2M14.2941 15.1647H22.2M14.2941 19.6824H22.2M14.2941 10.6471H22.2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LineHeight = memo(LineHeightInner)
LineHeight.displayName = 'LineHeight'