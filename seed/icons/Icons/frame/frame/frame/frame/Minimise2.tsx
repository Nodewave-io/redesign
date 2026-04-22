import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Minimise2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Minimise2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.55926 13.4896L10.511 13.4896M10.511 13.4896L10.511 20.4413M10.511 13.4896L2.40063 21.5999M20.4406 10.5105L13.4889 10.5105M13.4889 10.5105V3.55877M13.4889 10.5105L21.5993 2.40015" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Minimise2 = memo(Minimise2Inner)
Minimise2.displayName = 'Minimise2'