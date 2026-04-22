import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Volume5Inner = forwardRef<SVGSVGElement, IconProps>(
  function Volume5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.6824 8.07941C21.2661 10.5939 21.4898 13.9404 19.9833 16.9018M16.3459 9.72406C17.6827 11.2866 17.8715 13.3662 16.5999 15.2065M12 6L7.58775 9.4884H3V14.5111L7.58775 14.5099L12 18V6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Volume5 = memo(Volume5Inner)
Volume5.displayName = 'Volume5'