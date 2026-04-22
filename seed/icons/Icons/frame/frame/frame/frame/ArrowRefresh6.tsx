import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ArrowRefresh6Inner = forwardRef<SVGSVGElement, IconProps>(
  function ArrowRefresh6({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.48959 17.5104C3.17014 14.191 3.17014 8.80905 6.48959 5.48959C8.58797 3.39121 11.5105 2.61932 14.2152 3.1739M19.3525 6.46871C21.801 9.79488 21.5203 14.5005 18.5104 17.5104C16.3451 19.6757 13.3022 20.4286 10.5267 19.769M17.6684 7.83484V4.64734L20.8559 4.64734L17.6684 7.83484ZM7.24035 15.0742V18.2617H4.05285L7.24035 15.0742Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const ArrowRefresh6 = memo(ArrowRefresh6Inner)
ArrowRefresh6.displayName = 'ArrowRefresh6'