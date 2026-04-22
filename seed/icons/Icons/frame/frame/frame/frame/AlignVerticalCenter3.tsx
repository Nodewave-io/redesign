import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignVerticalCenter3Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignVerticalCenter3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9998 21.6V2.40002M5.11997 14.4L2.3999 11.7818M2.3999 11.7818L5.11997 9.16366M2.3999 11.7818H9.11458M18.8798 9.16366L21.5999 11.7818M21.5999 11.7818L18.8798 14.4M21.5999 11.7818L14.8852 11.7818" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignVerticalCenter3 = memo(AlignVerticalCenter3Inner)
AlignVerticalCenter3.displayName = 'AlignVerticalCenter3'