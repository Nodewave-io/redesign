import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FavouriteInner = forwardRef<SVGSVGElement, IconProps>(
  function Favourite({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.7899 6.48395H14.2066M11.5 15.1936L17.1669 20.2558C17.4891 20.5436 18 20.3149 18 19.8829V5C18 3.89543 17.1046 3 16 3H7C5.89543 3 5 3.89543 5 5V19.8829C5 20.3149 5.51092 20.5436 5.8331 20.2558L11.5 15.1936Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Favourite = memo(FavouriteInner)
Favourite.displayName = 'Favourite'