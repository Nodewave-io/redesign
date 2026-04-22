import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LetterSpacing2Inner = forwardRef<SVGSVGElement, IconProps>(
  function LetterSpacing2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M21.5999 2.40002V21.6M2.3999 21.6V2.40002M7.62846 16.8001L11.9999 6.60005L14.706 12.9143M14.706 12.9143L16.3713 16.8001M14.706 12.9143H9.57132" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LetterSpacing2 = memo(LetterSpacing2Inner)
LetterSpacing2.displayName = 'LetterSpacing2'