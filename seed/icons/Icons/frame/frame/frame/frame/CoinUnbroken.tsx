import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CoinUnbrokenInner = forwardRef<SVGSVGElement, IconProps>(
  function CoinUnbroken({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.85712 7.63627C8.63218 4.62496 11.3657 2.3999 14.619 2.3999C18.4749 2.3999 21.6008 5.52577 21.6008 9.38172C21.6008 12.4559 19.6139 15.0661 16.8542 15.9981M16.3628 14.6181C16.3628 18.474 13.2369 21.5999 9.38099 21.5999C5.52504 21.5999 2.39917 18.474 2.39917 14.6181C2.39917 10.7621 5.52504 7.63627 9.38099 7.63627C13.2369 7.63627 16.3628 10.7621 16.3628 14.6181Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CoinUnbroken = memo(CoinUnbrokenInner)
CoinUnbroken.displayName = 'CoinUnbroken'