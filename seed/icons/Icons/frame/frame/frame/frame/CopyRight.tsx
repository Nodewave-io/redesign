import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CopyRightInner = forwardRef<SVGSVGElement, IconProps>(
  function CopyRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20 13.1251L20 6.00003C20 4.34317 18.6568 3.00002 17 3.00004L9.875 3.00012M14 21.0001L7.25 21.0001C6.00736 21.0001 5 19.9928 5 18.7501L5 9.00012C5 7.75748 6.00736 6.75012 7.25 6.75012L14 6.75012C15.2426 6.75011 16.25 7.75748 16.25 9.00012L16.25 18.7501C16.25 19.9928 15.2426 21.0001 14 21.0001Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const CopyRight = memo(CopyRightInner)
CopyRight.displayName = 'CopyRight'