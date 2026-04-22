import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CardLockInner = forwardRef<SVGSVGElement, IconProps>(
  function CardLock({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.0002 18.3L4.20051 18.2999C2.87507 18.2998 1.80059 17.2254 1.80055 15.8999L1.80029 6.90007C1.80026 5.57456 2.87478 4.5 4.20029 4.5H18.5992C19.925 4.5 20.9998 5.57422 20.9998 6.89993L20.9998 8.7M2.39983 8.69985H20.3998M17.6998 15V14C17.6998 13.1716 18.3714 12.5 19.1998 12.5C20.0283 12.5 20.6998 13.1716 20.6998 14V15.5M17.1998 19.5H21.1998C21.7521 19.5 22.1998 19.0523 22.1998 18.5V16.5C22.1998 15.9478 21.7521 15.5 21.1998 15.5H17.1998C16.6475 15.5 16.1998 15.9478 16.1998 16.5V18.5C16.1998 19.0523 16.6475 19.5 17.1998 19.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CardLock = memo(CardLockInner)
CardLock.displayName = 'CardLock'