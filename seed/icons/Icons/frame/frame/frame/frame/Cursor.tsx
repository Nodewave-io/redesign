import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CursorInner = forwardRef<SVGSVGElement, IconProps>(
  function Cursor({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.565 18.3079L18.8759 21.3761C20.0589 21.9512 21.3207 20.7482 20.8026 19.5392L13.8272 3.26097C13.3419 2.12856 11.7437 2.10863 11.2303 3.22859L3.73425 19.5828C3.18646 20.7779 4.41641 22.0118 5.61325 21.4678L12.565 18.3079Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Cursor = memo(CursorInner)
Cursor.displayName = 'Cursor'