import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignHorizontalCenter2Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignHorizontalCenter2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 7.20002V2.40002M11.9999 21.6V16.2M4.7999 16.2H19.1999C20.5254 16.2 21.5999 15.1255 21.5999 13.8V10.2C21.5999 8.87454 20.5254 7.80002 19.1999 7.80002H4.7999C3.47442 7.80002 2.3999 8.87454 2.3999 10.2V13.8C2.3999 15.1255 3.47442 16.2 4.7999 16.2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignHorizontalCenter2 = memo(AlignHorizontalCenter2Inner)
AlignHorizontalCenter2.displayName = 'AlignHorizontalCenter2'