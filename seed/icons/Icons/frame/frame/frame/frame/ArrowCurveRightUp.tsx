import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowCurveRightUpInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowCurveRightUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.0859 4.19981L20.3999 9.51382M20.3999 9.51382L15.0859 14.8278M20.3999 9.51382L7.59991 9.51381C5.39077 9.51381 3.5999 11.3047 3.5999 13.5138L3.5999 19.7998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowCurveRightUp = memo(ArrowCurveRightUpInner)
ArrowCurveRightUp.displayName = 'ArrowCurveRightUp'