import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Type2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Type2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.08571 19.2002H12.3529M12.3529 19.2002H15.7714M12.3529 19.2002V4.80017M12.3529 4.80017H7.02857C6.46051 4.80017 6 5.26068 6 5.82874V7.34135M12.3529 4.80017H17.2538C17.8218 4.80017 18.2823 5.26068 18.2823 5.82874V7.76488" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Type2 = memo(Type2Inner)
Type2.displayName = 'Type2'