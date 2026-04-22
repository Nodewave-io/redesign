import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Lock2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Lock2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.60005 8.7999V7.88562C6.60005 4.84671 9.00862 2.3999 12 2.3999C14.9915 2.3999 17.4001 4.84671 17.4001 7.88562V8.7999M6.60005 8.7999C5.61005 8.7999 4.80005 9.62276 4.80005 10.6285V19.7713C4.80005 20.777 5.61005 21.5999 6.60005 21.5999H17.4001C18.3901 21.5999 19.2001 20.777 19.2001 19.7713V10.6285C19.2001 9.62276 18.3901 8.7999 17.4001 8.7999M6.60005 8.7999H17.4001M12 16.1999V13.7999" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Lock2 = memo(Lock2Inner)
Lock2.displayName = 'Lock2'