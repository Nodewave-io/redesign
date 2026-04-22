import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const WallertInner = forwardRef<SVGSVGElement, IconProps>(
  function Wallert({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M20.6401 14.7597V17.1998C20.6401 18.3044 19.7447 19.1998 18.6401 19.1998H4.40006C3.29552 19.1998 2.4001 18.3044 2.40006 17.1999L2.39972 6.79987C2.39969 5.69528 3.29513 4.7998 4.39972 4.7998H18.6401C19.7447 4.7998 20.6401 5.69524 20.6401 6.7998V9.17073M21.6001 14.7597H18.4801C17.0221 14.7597 15.8401 13.5777 15.8401 12.1197C15.8401 10.6617 17.0221 9.47969 18.4801 9.47969H21.6001V14.7597Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Wallert = memo(WallertInner)
Wallert.displayName = 'Wallert'