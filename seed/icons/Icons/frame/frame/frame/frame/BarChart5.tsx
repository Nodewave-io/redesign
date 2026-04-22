import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const BarChart5Inner = forwardRef<SVGSVGElement, IconProps>(
  function BarChart5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.6001 21.5999V19.4666M15.2001 21.5999V14.1332M8.8001 21.5999V8.7999M2.4001 21.5999V2.3999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const BarChart5 = memo(BarChart5Inner)
BarChart5.displayName = 'BarChart5'