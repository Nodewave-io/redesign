import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowCurveLeftUpInner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowCurveLeftUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.91411 4.1998L3.6001 9.51381M3.6001 9.51381L8.91411 14.8278M3.6001 9.51381L16.4001 9.51382C18.6092 9.51382 20.4001 11.3047 20.4001 13.5138L20.4001 19.7998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowCurveLeftUp = memo(ArrowCurveLeftUpInner)
ArrowCurveLeftUp.displayName = 'ArrowCurveLeftUp'