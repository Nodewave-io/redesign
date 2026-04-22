import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AddSquare2Inner = forwardRef<SVGSVGElement, IconProps>(
  function AddSquare2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <g opacity="0.9">
        <path d="M15.375 11.9995H12M12 11.9995H8.625M12 11.9995V15.3745M12 11.9995L12 8.62445M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
    )
  }
)

export const AddSquare2 = memo(AddSquare2Inner)
AddSquare2.displayName = 'AddSquare2'