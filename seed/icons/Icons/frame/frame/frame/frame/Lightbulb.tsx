import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LightbulbInner = forwardRef<SVGSVGElement, IconProps>(
  function Lightbulb({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.6 21.5999H14.4M10.2 9.5999H13.8M6 8.3999C6 5.08619 8.68629 2.3999 12 2.3999C15.3137 2.3999 18 5.08619 18 8.3999C18 10.8603 16.5191 12.874 14.4 13.7999V17.3999C14.4 18.0626 13.8627 18.5999 13.2 18.5999H10.8C10.1373 18.5999 9.6 18.0626 9.6 17.3999V13.9006C7.48091 12.9748 6 10.8603 6 8.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Lightbulb = memo(LightbulbInner)
Lightbulb.displayName = 'Lightbulb'