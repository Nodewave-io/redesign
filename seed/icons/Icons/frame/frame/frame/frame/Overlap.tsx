import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const OverlapInner = forwardRef<SVGSVGElement, IconProps>(
  function Overlap({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.1999 8.80002H4.7999C3.47442 8.80002 2.3999 9.87454 2.3999 11.2C2.3999 12.5255 2.3999 17.8745 2.3999 19.2C2.3999 20.5255 3.47442 21.6 4.7999 21.6C4.7999 21.6 11.4744 21.6 12.7999 21.6C14.1254 21.6 15.1999 20.5255 15.1999 19.2V16.2M19.1999 2.40003L11.1999 2.40002C9.87442 2.40002 8.7999 3.47454 8.7999 4.80002C8.7999 6.12551 8.7999 11.4745 8.7999 12.8C8.7999 14.1255 9.87442 15.2 11.1999 15.2C11.1999 15.2 17.8744 15.2 19.1999 15.2C20.5254 15.2 21.5999 14.1255 21.5999 12.8V4.80003C21.5999 3.47454 20.5254 2.40003 19.1999 2.40003Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Overlap = memo(OverlapInner)
Overlap.displayName = 'Overlap'