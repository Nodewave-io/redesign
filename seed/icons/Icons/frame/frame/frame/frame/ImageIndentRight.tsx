import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageIndentRightInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageIndentRight({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.6001 19.2L2.4001 19.2M10.8001 14L2.4001 14M10.8001 8.80001L2.4001 8.80001M21.6001 3.60001L2.4001 3.60001M20.4001 8.40001L16.8001 8.40001C16.1374 8.40001 15.6001 8.93727 15.6001 9.60001L15.6001 13.2C15.6001 13.8628 16.1374 14.4 16.8001 14.4L20.4001 14.4C21.0628 14.4 21.6001 13.8628 21.6001 13.2L21.6001 9.60001C21.6001 8.93727 21.0628 8.40001 20.4001 8.40001Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageIndentRight = memo(ImageIndentRightInner)
ImageIndentRight.displayName = 'ImageIndentRight'