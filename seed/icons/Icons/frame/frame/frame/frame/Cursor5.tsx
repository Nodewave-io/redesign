import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Cursor5Inner = forwardRef<SVGSVGElement, IconProps>(
  function Cursor5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.61917 12.4365L4.34103 13.7147M4.20747 9.02771H2.3999M4.34103 4.34159L5.61917 5.61974M9.02797 2.40002V4.20759M13.7141 4.34159L12.4359 5.61974M16.0175 15.9955L20.6198 14.3889C21.4824 14.0878 21.5158 12.8798 20.6708 12.5444L10.1413 8.87756C9.34974 8.56344 8.55383 9.3399 8.84805 10.1392L12.2959 20.9619C12.6099 21.8148 13.8173 21.8121 14.1404 20.9578L16.0175 15.9955Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Cursor5 = memo(Cursor5Inner)
Cursor5.displayName = 'Cursor5'