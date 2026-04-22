import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageUpInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageUp({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.375 21L15.9375 12L20.4375 16.5M6.375 21H17.625C19.489 21 21 19.489 21 17.625V12M6.375 21C4.51104 21 3 19.489 3 17.625V6.375C3 4.51104 4.51104 3 6.375 3H13.6875M16.5 5.28991L18.8009 3M18.8009 3L21 5.1864M18.8009 3V8.625M9.75 8.0625C9.75 8.99448 8.99448 9.75 8.0625 9.75C7.13052 9.75 6.375 8.99448 6.375 8.0625C6.375 7.13052 7.13052 6.375 8.0625 6.375C8.99448 6.375 9.75 7.13052 9.75 8.0625Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageUp = memo(ImageUpInner)
ImageUp.displayName = 'ImageUp'