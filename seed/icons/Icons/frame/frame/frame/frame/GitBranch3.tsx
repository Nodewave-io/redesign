import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GitBranch3Inner = forwardRef<SVGSVGElement, IconProps>(
  function GitBranch3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.71358 12H2.3999M21.5999 11.823H14.6879M14.6936 12C14.6936 13.5098 13.4696 14.7337 11.9599 14.7337C10.4501 14.7337 9.22615 13.5098 9.22615 12C9.22615 10.4902 10.4501 9.2663 11.9599 9.2663C13.4696 9.2663 14.6936 10.4902 14.6936 12Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const GitBranch3 = memo(GitBranch3Inner)
GitBranch3.displayName = 'GitBranch3'