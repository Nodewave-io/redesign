import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DividerInner = forwardRef<SVGSVGElement, IconProps>(
  function Divider({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 21V18.0811C3 17.0064 3.88316 16.1351 4.9726 16.1351L19.0274 16.1351C20.1168 16.1351 21 17.0064 21 18.0811V21M3 3V5.91892C3 6.99363 3.88316 7.86486 4.9726 7.86486H19.0274C20.1168 7.86486 21 6.99363 21 5.91892V3M3 12.0001H3.06007M7.42492 12.0001H7.48498M11.97 12.0001H12.03M16.455 12.0001H16.515M20.9399 12.0001H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Divider = memo(DividerInner)
Divider.displayName = 'Divider'