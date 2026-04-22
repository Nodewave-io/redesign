import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageAvatarInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageAvatar({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.25 19.8749V18.1874C5.25 16.9447 6.25736 15.9374 7.5 15.9374H16.5C17.7426 15.9374 18.75 16.9447 18.75 18.1874V20.4374M5.25 21C4.00736 21 3 19.9396 3 18.6316V5.36842C3 4.06038 4.00736 3 5.25 3H18.75C19.9926 3 21 4.06038 21 5.36842V18.6316C21 19.9396 19.9926 21 18.75 21H5.25ZM14.8125 9.18739C14.8125 10.7407 13.5533 11.9999 12 11.9999C10.4467 11.9999 9.1875 10.7407 9.1875 9.18739C9.1875 7.63409 10.4467 6.37489 12 6.37489C13.5533 6.37489 14.8125 7.63409 14.8125 9.18739Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageAvatar = memo(ImageAvatarInner)
ImageAvatar.displayName = 'ImageAvatar'