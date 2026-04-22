import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowCurveLeftDownInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowCurveLeftDown({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.91411 19.8002L3.6001 14.4862M3.6001 14.4862L8.91411 9.17217M3.6001 14.4862H16.4001C18.6092 14.4862 20.4001 12.6953 20.4001 10.4862V4.2002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowCurveLeftDown = memo(ArrowCurveLeftDownInner)
ArrowCurveLeftDown.displayName = 'ArrowCurveLeftDown'