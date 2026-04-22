import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageIndentLeftInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageIndentLeft({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 3.59998L21.5999 3.59998M13.1999 8.79998L21.5999 8.79998M13.1999 14L21.5999 14M2.3999 19.2H21.5999M3.5999 14.4H7.1999C7.86264 14.4 8.3999 13.8627 8.3999 13.2V9.59998C8.3999 8.93723 7.86264 8.39998 7.1999 8.39998H3.5999C2.93716 8.39998 2.3999 8.93723 2.3999 9.59998V13.2C2.3999 13.8627 2.93716 14.4 3.5999 14.4Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageIndentLeft = memo(ImageIndentLeftInner)
ImageIndentLeft.displayName = 'ImageIndentLeft'