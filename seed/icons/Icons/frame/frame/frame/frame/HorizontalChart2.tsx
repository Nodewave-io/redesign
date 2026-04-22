import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const HorizontalChart2Inner = forwardRef<SVGSVGElement, IconProps>(
  function HorizontalChart2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 14.3547H7.17801M3 14.3547L7.1196 14.3536C7.13918 14.3536 7.15866 14.354 7.17801 14.3547M3 14.3547L3 18.2399C3 18.7701 3.53726 19.1999 4.2 19.1999H7.12C7.78274 19.1999 8.32 18.7701 8.32 18.2399V15.3136C8.32 14.799 7.81379 14.3789 7.17801 14.3547M3 14.3547L3 9.50813M7.17801 14.3547H12.776C13.4387 14.3547 13.976 13.9249 13.976 13.3947V10.4681C13.976 9.93793 13.4387 9.50813 12.776 9.50813M3 9.50813H12.776M3 9.50813L3 5.7599C3 5.22971 3.53726 4.7999 4.2 4.7999L19.8 4.7999C20.4627 4.7999 21 5.22971 21 5.7599V8.54813C21 9.07832 20.4627 9.50813 19.8 9.50813L12.776 9.50813M3 21.5999V2.3999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const HorizontalChart2 = memo(HorizontalChart2Inner)
HorizontalChart2.displayName = 'HorizontalChart2'