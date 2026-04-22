import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GitBranchInner = forwardRef<SVGSVGElement, IconProps>(
  function GitBranch({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.9681 18.2209C13.9681 19.5248 15.0252 20.5818 16.3291 20.5818C17.633 20.5818 18.69 19.5248 18.69 18.2209C18.69 16.917 17.633 15.86 16.3291 15.86C15.0252 15.86 13.9681 16.917 13.9681 18.2209ZM13.9681 18.2209H10.0005C7.79144 18.2209 6.00061 16.4302 6.0005 14.2211L6 4M13.5255 8.77719H6M18.69 8.77719C18.69 10.0811 17.633 11.1381 16.3291 11.1381C15.0252 11.1381 13.9681 10.0811 13.9681 8.77719C13.9681 7.47329 15.0252 6.41626 16.3291 6.41626C17.633 6.41626 18.69 7.47329 18.69 8.77719Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const GitBranch = memo(GitBranchInner)
GitBranch.displayName = 'GitBranch'