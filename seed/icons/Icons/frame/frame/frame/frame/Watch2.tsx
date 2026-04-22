import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Watch2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Watch2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.8633 18.0412L14.9894 20.6629C14.9222 20.8643 14.7338 21.0001 14.5215 21.0001H9.31459C9.10233 21.0001 8.91387 20.8643 8.84675 20.6629L7.97285 18.0412M7.97285 5.95903L8.84675 3.33732C8.91387 3.13595 9.10232 3.00012 9.31459 3.00012H14.5215C14.7338 3.00012 14.9222 3.13595 14.9894 3.33732L15.8633 5.95903M7.4797 18.0412H16.3564C17.1735 18.0412 17.8359 17.3788 17.8359 16.5618V7.68505C17.8359 6.86797 17.1735 6.2056 16.3564 6.2056H7.4797C6.66262 6.2056 6.00024 6.86797 6.00024 7.68505V16.5618C6.00024 17.3788 6.66262 18.0412 7.4797 18.0412Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Watch2 = memo(Watch2Inner)
Watch2.displayName = 'Watch2'