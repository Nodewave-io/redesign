import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageCheckInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageCheck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.30609 20.6325L15.6733 11.8162L20.0815 16.2244M6.30609 20.6325H17.3264C19.1523 20.6325 20.6325 19.1523 20.6325 17.3264V9.61218M6.30609 20.6325C4.48019 20.6325 3 19.1523 3 17.3264V6.30609C3 4.48019 4.48019 3 6.30609 3H14.5713M15.4902 5.75507L17.1427 7.4083L21 3.55101M9.61218 7.95913C9.61218 8.87208 8.87208 9.61218 7.95913 9.61218C7.04618 9.61218 6.30609 8.87208 6.30609 7.95913C6.30609 7.04618 7.04618 6.30609 7.95913 6.30609C8.87208 6.30609 9.61218 7.04618 9.61218 7.95913Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageCheck = memo(ImageCheckInner)
ImageCheck.displayName = 'ImageCheck'