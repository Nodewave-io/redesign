import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Ticket2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Ticket2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.3995 14.8597V8.95333M5.01172 3.45972H12.001C12.0407 4.87478 13.2003 6.00972 14.625 6.00972C16.0496 6.00972 17.2092 4.87478 17.2489 3.45972H18.9882C21.0934 3.45972 22.7999 5.1663 22.7999 7.27148V16.7284C22.7999 18.8336 21.0934 20.5402 18.9882 20.5402H17.2489C17.2092 19.1251 16.0496 17.9902 14.625 17.9902C13.2003 17.9902 12.0407 19.1251 12.001 20.5402H5.01173C2.90655 20.5402 1.19996 18.8336 1.19996 16.7284L1.19995 7.27148C1.19995 5.1663 2.90654 3.45972 5.01172 3.45972Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Ticket2 = memo(Ticket2Inner)
Ticket2.displayName = 'Ticket2'