import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const GitBranch4Inner = forwardRef<SVGSVGElement, IconProps>(
  function GitBranch4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.0084 16.5C15.0084 17.8807 16.1258 19 17.5042 19C18.8826 19 20 17.8807 20 16.5C20 15.1193 18.8826 14 17.5042 14C16.1258 14 15.0084 15.1193 15.0084 16.5ZM15.0084 16.5H12.5133C9.21052 16.5 6.53309 13.8181 6.53309 10.5097V9.00126M8.99158 6.5C8.99158 7.88071 7.87418 9 6.49579 9C5.1174 9 4 7.88071 4 6.5C4 5.11929 5.1174 4 6.49579 4C7.87418 4 8.99158 5.11929 8.99158 6.5Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const GitBranch4 = memo(GitBranch4Inner)
GitBranch4.displayName = 'GitBranch4'