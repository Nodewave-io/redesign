import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LetterSpacing3Inner = forwardRef<SVGSVGElement, IconProps>(
  function LetterSpacing3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 7.05395L5.85387 3.59998M5.85387 3.59998L9.30784 7.05395M5.85387 3.59998V19.7185M2.3999 16.2645L5.85387 19.7185M5.85387 19.7185L9.30784 16.2645M14.2856 17.4159H17.3332M17.3332 17.4159H20.3809M17.3332 17.4159V7.05395M17.3332 7.05395H12.7618V8.88252M17.3332 7.05395H21.5999V9.18728" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LetterSpacing3 = memo(LetterSpacing3Inner)
LetterSpacing3.displayName = 'LetterSpacing3'