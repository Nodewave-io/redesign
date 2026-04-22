import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const KeyInner = forwardRef<SVGSVGElement, IconProps>(
  function Key({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.67873 6.5999H7.7999M14.6181 9.38172L21.307 16.0706C21.4945 16.2582 21.5999 16.5125 21.5999 16.7778V20.5999C21.5999 21.1522 21.1522 21.5999 20.5999 21.5999H18.109V18.9817H15.4908V16.3635L12.266 13.3266C11.2298 14.1359 9.92569 14.6181 8.50899 14.6181C5.13503 14.6181 2.3999 11.8829 2.3999 8.50899C2.3999 5.13503 5.13503 2.3999 8.50899 2.3999C11.8829 2.3999 14.6181 5.13503 14.6181 8.50899V9.38172Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Key = memo(KeyInner)
Key.displayName = 'Key'