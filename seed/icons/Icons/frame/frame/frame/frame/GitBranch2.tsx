import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GitBranch2Inner = forwardRef<SVGSVGElement, IconProps>(
  function GitBranch2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.50405 14.9919C7.887 14.9919 9.0081 16.113 9.0081 17.496C9.0081 18.8789 7.887 20 6.50405 20C5.1211 20 4 18.8789 4 17.496C4 16.113 5.1211 14.9919 6.50405 14.9919ZM6.50405 14.9919L6.50405 6.50405M16.5203 9.0081C17.9032 9.0081 19.0243 7.887 19.0243 6.50405C19.0243 5.1211 17.9032 4 16.5203 4C15.1373 4 14.0162 5.1211 14.0162 6.50405C14.0162 7.887 15.1373 9.0081 16.5203 9.0081ZM16.5203 9.0081L16.5203 13.4585C16.5203 15.6677 14.7294 17.4585 12.5203 17.4585L9.00937 17.4585" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const GitBranch2 = memo(GitBranch2Inner)
GitBranch2.displayName = 'GitBranch2'