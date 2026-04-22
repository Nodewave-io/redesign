import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FlashOffInner = forwardRef<SVGSVGElement, IconProps>(
  function FlashOff({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.1483 18.3205L12.0933 21.3199C11.7405 21.8284 10.9102 21.6001 10.9102 20.9878L10.8998 15.1343C10.8998 14.4597 10.329 13.9201 9.6233 13.9097L5.4408 13.8578C4.93226 13.8474 4.63129 13.3181 4.91151 12.9134L6.60319 10.4537M8.35714 7.86947L11.9065 2.68028C12.2594 2.17174 13.0897 2.40007 13.0897 3.01239L13.1 8.86581C13.1 9.54041 13.6709 10.0801 14.3766 10.0905L18.5591 10.1423C19.0676 10.1527 19.3686 10.682 19.0884 11.0868L15.8296 15.8401M20.4001 20.3998L3.6001 3.5998" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FlashOff = memo(FlashOffInner)
FlashOff.displayName = 'FlashOff'