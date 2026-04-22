import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ScaleInner = forwardRef<SVGSVGElement, IconProps>(
  function Scale({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.36287 2.40002C3.72647 2.40002 2.3999 3.72659 2.3999 5.36299M14.1332 2.40002H9.86657M21.5999 5.36299C21.5999 3.72659 20.2733 2.40002 18.6369 2.40002M2.3999 9.86669V14.1334M21.5999 14.1334V9.86669M2.3999 18.6371C2.3999 20.2735 3.72647 21.6 5.36286 21.6M18.6369 21.6C20.2733 21.6 21.5999 20.2735 21.5999 18.6371M9.86657 21.6H14.1332M2.3999 12H9.86657C11.0448 12 11.9999 12.9551 11.9999 14.1334V21.6H5.5999C3.83259 21.6 2.3999 20.1673 2.3999 18.4V12Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Scale = memo(ScaleInner)
Scale.displayName = 'Scale'