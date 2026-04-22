import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ColumnVertical2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ColumnVertical2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 3L19.0274 3C20.1168 3 21 3.88316 21 4.9726V19.0274C21 20.1168 20.1168 21 19.0274 21H12M12 3L4.9726 3C3.88316 3 3 3.88316 3 4.9726L3 19.0274C3 20.1168 3.88317 21 4.9726 21H12M12 3V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ColumnVertical2 = memo(ColumnVertical2Inner)
ColumnVertical2.displayName = 'ColumnVertical2'