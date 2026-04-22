import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Calendar2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Calendar2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.33056 7.61447H17.4493M6.87442 2.0001V3.8317M6.87442 3.8317L17.4991 3.8315M6.87442 3.8317C5.11401 3.8317 3.68708 5.28333 3.68716 7.07419L3.68766 17.8826C3.68774 19.6734 5.11476 21.125 6.87506 21.125H17.4998C19.2602 21.125 20.6872 19.6732 20.6872 17.8823L20.6867 7.07389C20.6866 5.28314 19.2594 3.8315 17.4991 3.8315M17.4991 2V3.8315M10.0626 17.342V10.8569L7.93768 12.4782M15.9062 17.342V10.8569L13.7813 12.4782" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Calendar2 = memo(Calendar2Inner)
Calendar2.displayName = 'Calendar2'