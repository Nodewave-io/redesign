import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LetterSpacingInner = forwardRef<SVGSVGElement, IconProps>(
  function LetterSpacing({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.76304 20.7541L2.3999 17.391M2.3999 17.391L5.76304 14.0278M2.3999 17.391H21.5999M18.2368 20.7541L21.5999 17.391M21.5999 17.391L18.2368 14.0278M12.2584 12.4894V2.40002M12.2584 2.40002L7.80719 2.40002M12.2584 2.40002L16.4129 2.40002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const LetterSpacing = memo(LetterSpacingInner)
LetterSpacing.displayName = 'LetterSpacing'