import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Layers5Inner = forwardRef<SVGSVGElement, IconProps>(
  function Layers5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 11.9752L11.9999 16.8959L2.3999 11.9752M21.5999 16.6793L11.9999 21.6L2.3999 16.6793M11.9999 2.40002L21.5999 7.32077L11.9999 12.2415L2.3999 7.32077L11.9999 2.40002Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Layers5 = memo(Layers5Inner)
Layers5.displayName = 'Layers5'