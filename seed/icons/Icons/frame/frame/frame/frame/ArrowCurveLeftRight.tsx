import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowCurveLeftRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowCurveLeftRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.0859 19.8002L20.3999 14.4862M20.3999 14.4862L15.0859 9.17217M20.3999 14.4862H7.59991C5.39077 14.4862 3.5999 12.6953 3.5999 10.4862V4.2002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowCurveLeftRight = memo(ArrowCurveLeftRightInner)
ArrowCurveLeftRight.displayName = 'ArrowCurveLeftRight'