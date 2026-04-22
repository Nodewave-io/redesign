import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CalendarPlusInner = forwardRef<SVGSVGElement, IconProps>(
  function CalendarPlus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.5 8.91425H19.5M7.30952 3V4.54304M17.5 3V4.54285M17.5 4.54285H7.5C5.84315 4.54285 4.5 5.92436 4.5 7.62855V17.9143C4.5 19.6185 5.84315 21 7.5 21H17.5C19.1569 21 20.5 19.6185 20.5 17.9143L20.5 7.62855C20.5 5.92436 19.1569 4.54285 17.5 4.54285ZM12.5 12V14.5714M12.5 14.5714V17.1428M12.5 14.5714H15M12.5 14.5714H10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CalendarPlus = memo(CalendarPlusInner)
CalendarPlus.displayName = 'CalendarPlus'