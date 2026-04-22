import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Loader2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Loader2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.3501 5.7001V2.1001M13.3501 21.9001V17.1001M19.0501 11.4001H21.1501M2.8501 11.4001H7.6501M17.381 7.3698L19.0507 5.7001M5.92474 18.8249L9.31885 15.4308M17.381 15.4304L19.0501 17.0995M5.92474 3.97532L9.31885 7.36943" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Loader2 = memo(Loader2Inner)
Loader2.displayName = 'Loader2'