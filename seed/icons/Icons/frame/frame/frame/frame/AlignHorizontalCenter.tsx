import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignHorizontalCenterInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignHorizontalCenter({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 11.9997L21.5999 11.9997M14.6181 6.39464L11.9999 9.11471M11.9999 9.11471L9.38172 6.39464M11.9999 9.11471V2.40002M9.38172 17.6054L11.9999 14.8853M11.9999 14.8853L14.6181 17.6054M11.9999 14.8853V21.6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignHorizontalCenter = memo(AlignHorizontalCenterInner)
AlignHorizontalCenter.displayName = 'AlignHorizontalCenter'