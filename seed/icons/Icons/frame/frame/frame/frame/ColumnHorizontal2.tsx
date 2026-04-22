import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ColumnHorizontal2Inner = forwardRef<SVGSVGElement, IconProps>(
  function ColumnHorizontal2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.46189 12.2465H21M18.7805 21H4.94222C3.86956 21 3 20.1168 3 19.0274L3 4.9726C3 3.88316 3.86956 3 4.94222 3L18.7805 3C19.8532 3 20.7227 3.88316 20.7227 4.9726V19.0274C20.7227 20.1168 19.8532 21 18.7805 21Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const ColumnHorizontal2 = memo(ColumnHorizontal2Inner)
ColumnHorizontal2.displayName = 'ColumnHorizontal2'