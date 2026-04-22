import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderX2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FolderX2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.5997 19.7116H4.80068C3.47519 19.7116 2.40067 18.637 2.40068 17.3115L2.40077 8.18724C2.40078 7.27332 2.40044 5.97159 2.40015 5.02904C2.39994 4.36612 2.93728 3.82935 3.60019 3.82935H9.31841L12.0834 6.78298H20.3997C21.0625 6.78298 21.5997 7.32024 21.5997 7.98298V11.1706M21.5997 20.1706L19.1997 17.7706M19.1997 17.7706L16.7997 15.3706M19.1997 17.7706L16.7997 20.1706M19.1997 17.7706L21.5997 15.3706" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderX2 = memo(FolderX2Inner)
FolderX2.displayName = 'FolderX2'