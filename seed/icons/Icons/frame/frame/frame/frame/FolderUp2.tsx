import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderUp2Inner = forwardRef<SVGSVGElement, IconProps>(
  function FolderUp2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.026 19.7116L4.77382 19.7116C3.44833 19.7116 2.37381 18.637 2.37383 17.3116L2.37392 8.18724C2.37392 7.27332 2.37358 5.97159 2.37329 5.02904C2.37309 4.36612 2.91042 3.82935 3.57334 3.82935H9.29155L12.0566 6.78298H20.3729C21.0356 6.78298 21.5729 7.32024 21.5729 7.98298V11.1706M16.8268 16.6131L19.2811 14.1706M19.2811 14.1706L21.6268 16.5027M19.2811 14.1706V20.1706" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderUp2 = memo(FolderUp2Inner)
FolderUp2.displayName = 'FolderUp2'