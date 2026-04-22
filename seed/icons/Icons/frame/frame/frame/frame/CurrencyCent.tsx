import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CurrencyCentInner = forwardRef<SVGSVGElement, IconProps>(
  function CurrencyCent({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M17 7.54C15.9015 6.54696 14.4728 5.99803 12.992 6M12.992 6C12.2046 6.00053 11.425 6.15614 10.6977 6.45795C9.97047 6.75976 9.30977 7.20186 8.75336 7.75902C8.19695 8.31617 7.75573 8.97746 7.45489 9.70513C7.15405 10.4328 6.99948 11.2126 7 12C7 15.314 9.682 18 12.992 18M12.992 6L12.993 4M12.992 18C14.4709 18.0021 15.8979 17.4547 16.996 16.464M12.992 18L12.993 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CurrencyCent = memo(CurrencyCentInner)
CurrencyCent.displayName = 'CurrencyCent'