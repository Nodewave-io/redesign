import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MaximiseInner = forwardRef<SVGSVGElement, IconProps>(
  function Maximise({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.6476 2.40002H21.5994M21.5994 2.40002V9.35175M21.5994 2.40002L13.489 10.5104M9.35236 21.6H2.40063M2.40063 21.6V14.6483M2.40063 21.6L10.511 13.4897" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Maximise = memo(MaximiseInner)
Maximise.displayName = 'Maximise'