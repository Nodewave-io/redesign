import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FolderOpen3Inner = forwardRef<SVGSVGElement, IconProps>(
  function FolderOpen3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.39974 5.32959V3.52959C5.39974 2.86685 5.937 2.32959 6.59974 2.32959H17.9997C18.6625 2.32959 19.1997 2.86685 19.1997 3.52959V8.32959M2.40068 19.2706L2.40077 10.1463C2.40078 9.23235 2.40044 7.93062 2.40015 6.98807C2.39994 6.32515 2.93728 5.78838 3.60019 5.78838H9.31841L12.0834 8.74202H20.3997C21.0625 8.74202 21.5997 9.2793 21.5997 9.94205L21.5994 19.2707C21.5994 20.5962 20.5249 21.6707 19.1994 21.6707L4.80068 21.6706C3.47519 21.6706 2.40067 20.5961 2.40068 19.2706Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FolderOpen3 = memo(FolderOpen3Inner)
FolderOpen3.displayName = 'FolderOpen3'