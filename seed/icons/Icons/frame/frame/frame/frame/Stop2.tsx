import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Stop2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Stop2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17.625 3H6.375C4.51104 3 3 4.51104 3 6.375V17.625C3 19.489 4.51104 21 6.375 21H17.625C19.489 21 21 19.489 21 17.625V6.375C21 4.51104 19.489 3 17.625 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8.625 9.89062C8.625 9.19164 9.19164 8.625 9.89062 8.625H14.1094C14.8084 8.625 15.375 9.19164 15.375 9.89062V14.1094C15.375 14.8084 14.8084 15.375 14.1094 15.375H9.89062C9.19164 15.375 8.625 14.8084 8.625 14.1094V9.89062Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Stop2 = memo(Stop2Inner)
Stop2.displayName = 'Stop2'