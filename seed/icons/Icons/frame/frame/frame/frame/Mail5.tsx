import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Mail5Inner = forwardRef<SVGSVGElement, IconProps>(
  function Mail5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3 5.25V18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V5.25M3 5.25C3 4.00736 4.00736 3 5.25 3H18.75C19.9926 3 21 4.00736 21 5.25M3 5.25C3 6.49264 4.00736 7.5 5.25 7.5H18.75C19.9926 7.5 21 6.49264 21 5.25M6.9375 14.25H11.4375M6.9375 17.625H9.75" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Mail5 = memo(Mail5Inner)
Mail5.displayName = 'Mail5'