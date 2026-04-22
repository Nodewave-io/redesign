import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CalendarInner = forwardRef<SVGSVGElement, IconProps>(
  function Calendar({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.9514 10.9375L17.3125 13.5938M17.3125 13.5938L14.9514 16.25M17.3125 13.5938H7.75M7.75 7.21927H16.6042M20.5 6.6875V17.3125C20.5 19.0729 19.0729 20.5 17.3125 20.5H6.6875C4.92709 20.5 3.5 19.0729 3.5 17.3125V6.6875C3.5 4.92709 4.92709 3.5 6.6875 3.5H17.3125C19.0729 3.5 20.5 4.92709 20.5 6.6875Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Calendar = memo(CalendarInner)
Calendar.displayName = 'Calendar'