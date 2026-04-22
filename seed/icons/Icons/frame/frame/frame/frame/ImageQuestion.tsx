import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ImageQuestionInner = forwardRef<SVGSVGElement, IconProps>(
  function ImageQuestion({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.375 21.125L15.9375 12.125L20.4375 16.625M6.375 21.125H17.625C19.489 21.125 21 19.614 21 17.75V11.5625M6.375 21.125C4.51104 21.125 3 19.614 3 17.75V6.5C3 4.63604 4.51104 3.125 6.375 3.125H12.5625M16.5 4.20113C16.5 2.98548 17.5074 2 18.75 2C19.9926 2 21 2.98548 21 4.20113C21 5.41679 19.9926 6.40227 18.75 6.40227M18.75 9.3971V9.3125M9.75 8.1875C9.75 9.11948 8.99448 9.875 8.0625 9.875C7.13052 9.875 6.375 9.11948 6.375 8.1875C6.375 7.25552 7.13052 6.5 8.0625 6.5C8.99448 6.5 9.75 7.25552 9.75 8.1875Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ImageQuestion = memo(ImageQuestionInner)
ImageQuestion.displayName = 'ImageQuestion'