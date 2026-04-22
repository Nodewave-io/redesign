import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LockInner = forwardRef<SVGSVGElement, IconProps>(
  function Lock({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.60005 8.7999V7.88562C6.60005 4.84671 9.00862 2.3999 12 2.3999C14.9915 2.3999 17.4001 4.84671 17.4001 7.88562V8.7999M6.60005 8.7999C5.61005 8.7999 4.80005 9.62276 4.80005 10.6285V19.7713C4.80005 20.777 5.61005 21.5999 6.60005 21.5999H17.4001C18.3901 21.5999 19.2001 20.777 19.2001 19.7713V10.6285C19.2001 9.62276 18.3901 8.7999 17.4001 8.7999M6.60005 8.7999H17.4001M12 13.3713C12.9901 13.3713 13.8001 14.1942 13.8001 15.1999C13.8001 16.2056 12.9901 17.0285 12 17.0285C11.01 17.0285 10.2 16.2056 10.2 15.1999C10.2 14.1942 11.01 13.3713 12 13.3713Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Lock = memo(LockInner)
Lock.displayName = 'Lock'