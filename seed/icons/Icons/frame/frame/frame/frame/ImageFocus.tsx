import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageFocusInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageFocus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9M9 21H5C3.89543 21 3 20.1046 3 19V15M15 3H19C20.1046 3 21 3.89543 21 5V9M21 15V19C21 20.1046 20.1046 21 19 21H15M9.75 15.375H14.25C14.8713 15.375 15.375 14.8713 15.375 14.25V9.75C15.375 9.12868 14.8713 8.625 14.25 8.625H9.75C9.12868 8.625 8.625 9.12868 8.625 9.75V14.25C8.625 14.8713 9.12868 15.375 9.75 15.375Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const ImageFocus = memo(ImageFocusInner)
ImageFocus.displayName = 'ImageFocus'