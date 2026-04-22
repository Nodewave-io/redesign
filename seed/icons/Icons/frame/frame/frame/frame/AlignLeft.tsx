import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function AlignLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 2.40002V21.6M19.1999 7.80003L9.5999 7.80002C8.27442 7.80002 7.1999 8.87454 7.1999 10.2V13.8C7.1999 15.1255 8.27442 16.2 9.5999 16.2L19.1999 16.2C20.5254 16.2 21.5999 15.1255 21.5999 13.8V10.2C21.5999 8.87454 20.5254 7.80003 19.1999 7.80003Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignLeft = memo(AlignLeftInner)
AlignLeft.displayName = 'AlignLeft'