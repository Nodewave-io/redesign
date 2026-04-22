import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LoaderInner = forwardRef<SVGSVGElement, IconProps>(
  function Loader({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12 7.11429V3M12 21V16.8857M16.8857 12H21M3 12H7.11429M15.455 8.54546L18.3643 5.63622M5.6354 18.3641L8.54464 15.4549M15.455 15.4545L18.3643 18.3638M5.6354 5.63591L8.54464 8.54515" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Loader = memo(LoaderInner)
Loader.displayName = 'Loader'