import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Edit2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Edit2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.4487 6.95143L17.0487 10.5514M4.44873 19.5514L8.81472 18.6717C9.04649 18.625 9.25931 18.5109 9.42645 18.3437L19.2001 8.56461C19.6687 8.09576 19.6684 7.33577 19.1994 6.86731L17.129 4.79923C16.6602 4.33097 15.9006 4.33129 15.4322 4.79995L5.65749 14.58C5.49068 14.7469 5.37678 14.9593 5.33003 15.1906L4.44873 19.5514Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Edit2 = memo(Edit2Inner)
Edit2.displayName = 'Edit2'