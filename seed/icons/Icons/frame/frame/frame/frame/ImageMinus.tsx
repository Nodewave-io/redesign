import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageMinusInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageMinus({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.69739 20.5001L14.756 11.9744L19.0188 16.2373M5.69739 20.5001H16.3545C18.1203 20.5001 19.5517 19.0687 19.5517 17.303V11.9744M5.69739 20.5001C3.93165 20.5001 2.50024 19.0687 2.50024 17.303V6.64585C2.50024 4.88011 3.93165 3.44871 5.69739 3.44871H12.6245M15.4717 6.64585H21.5002M8.89453 8.24442C8.89453 9.12728 8.17882 9.84299 7.29596 9.84299C6.41309 9.84299 5.69739 9.12728 5.69739 8.24442C5.69739 7.36155 6.41309 6.64585 7.29596 6.64585C8.17882 6.64585 8.89453 7.36155 8.89453 8.24442Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageMinus = memo(ImageMinusInner)
ImageMinus.displayName = 'ImageMinus'