import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GitBranch5Inner = forwardRef<SVGSVGElement, IconProps>(
  function GitBranch5({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.66667 8.34209C8.13943 8.34209 9.33333 7.14625 9.33333 5.67111C9.33333 4.19596 8.13943 3.00012 6.66667 3.00012C5.19391 3.00012 4 4.19596 4 5.67111C4 7.14625 5.19391 8.34209 6.66667 8.34209ZM6.66667 8.34209V20.0668M17.3333 14.7248C18.8061 14.7248 20 15.9207 20 17.3958C20 18.8709 18.8061 20.0668 17.3333 20.0668C15.8606 20.0668 14.6667 18.8709 14.6667 17.3958C14.6667 15.9207 15.8606 14.7248 17.3333 14.7248ZM17.3333 14.7248V8.37769C17.3333 6.90493 16.1394 5.71103 14.6667 5.71103H13.0667" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const GitBranch5 = memo(GitBranch5Inner)
GitBranch5.displayName = 'GitBranch5'