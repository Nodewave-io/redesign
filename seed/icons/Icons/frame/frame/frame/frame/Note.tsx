import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const NoteInner = forwardRef<SVGSVGElement, IconProps>(
  function Note({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M18.5686 4.42105L13.5157 2.3999V17.5585C13.5156 18.4483 13.2218 19.3132 12.6799 20.019C12.1381 20.7249 11.3785 21.2322 10.519 21.4623C9.65949 21.6925 8.74804 21.6326 7.92601 21.292C7.10398 20.9514 6.41731 20.349 5.9725 19.5784C5.52768 18.8077 5.34957 17.9118 5.46578 17.0296C5.582 16.1475 5.98605 15.3283 6.61528 14.6991C7.24451 14.07 8.06374 13.666 8.94594 13.5499C9.82814 13.4338 10.724 13.612 11.4946 14.0569C11.8315 14.2135 13.1852 15.2991 13.5157 16.0427" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Note = memo(NoteInner)
Note.displayName = 'Note'