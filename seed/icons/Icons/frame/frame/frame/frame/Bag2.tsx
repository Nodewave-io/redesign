import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Bag2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Bag2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M16.4107 10.7088L16.4046 10.7026M8.1141 10.7088L8.10798 10.7026M16.4107 6.55125C16.4107 4.25853 14.5521 2.3999 12.2594 2.3999C9.96664 2.3999 8.10802 4.25853 8.10802 6.55125M5.51342 21.5999H18.4864C19.6328 21.5999 20.5621 20.6706 20.5621 19.5242V8.62693C20.5621 7.48056 19.6328 6.55125 18.4864 6.55125H5.51342C4.36706 6.55125 3.43774 7.48056 3.43774 8.62693V19.5242C3.43774 20.6706 4.36706 21.5999 5.51342 21.5999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Bag2 = memo(Bag2Inner)
Bag2.displayName = 'Bag2'