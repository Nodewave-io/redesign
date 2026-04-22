import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ColorPickerInner = forwardRef<SVGSVGElement, IconProps>(
  function ColorPicker({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.473 6.60711L17.3928 13.5269M2.3999 16.9868L16.0313 3.35545C17.3052 2.08155 19.3706 2.08155 20.6445 3.35545C21.9184 4.62935 21.9184 6.69475 20.6445 7.96865L7.0131 21.6H2.3999V16.9868Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ColorPicker = memo(ColorPickerInner)
ColorPicker.displayName = 'ColorPicker'