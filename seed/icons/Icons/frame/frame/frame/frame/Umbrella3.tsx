import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Umbrella3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Umbrella3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.8727 12.6752L10.4496 16.8722M17.2672 3.91284C15.2148 5.16508 11.0639 8.44046 10.8788 11.5241M18.2641 4.4884C18.2513 6.91816 17.5675 12.1953 14.935 13.8659M1.80005 19.1898L4.3335 18.0753C5.88155 17.3942 7.58722 17.1526 9.26352 17.3769L9.3411 17.3872C11.0432 17.6149 12.6477 18.314 13.9735 19.4054L16 21.0737M6.66626 9.09195L19.0792 16.2585C19.7812 16.6639 20.6789 16.4233 21.0843 15.7213C23.3812 11.7429 22.0181 6.65579 18.0397 4.35888L17.4914 4.04228C13.513 1.74537 8.4259 3.10846 6.12899 7.08682C5.72365 7.78889 5.9642 8.68661 6.66626 9.09195Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Umbrella3 = memo(Umbrella3Inner)
Umbrella3.displayName = 'Umbrella3'