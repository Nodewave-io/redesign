import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Bag3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Bag3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.5999 8.34215C15.5999 10.3304 13.9881 11.9422 11.9999 11.9422C10.0117 11.9422 8.3999 10.3304 8.3999 8.34215M4.72717 20.9422H19.2726C20.5579 20.9422 21.5999 19.9196 21.5999 18.6581L20.109 5.34212C20.109 4.08069 19.067 3.05811 17.7817 3.05811H5.92717C4.64186 3.05811 3.5999 4.08069 3.5999 5.34212L2.3999 18.6581C2.3999 19.9196 3.44186 20.9422 4.72717 20.9422Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Bag3 = memo(Bag3Inner)
Bag3.displayName = 'Bag3'