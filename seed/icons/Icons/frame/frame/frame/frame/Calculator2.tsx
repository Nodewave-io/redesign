import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Calculator2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Calculator2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 12.2595H11.7404M12.2594 21.6V2.40002M7.32963 9.14597V5.773M5.64314 7.45948H9.01612M5.64314 17.4487H9.01612M15.3729 14.0757H18.7458M15.3729 10.9622H18.7458M4.9945 21.6H19.0053C20.4383 21.6 21.5999 20.4384 21.5999 19.0054V4.99462C21.5999 3.56166 20.4383 2.40002 19.0053 2.40002H4.9945C3.56154 2.40002 2.3999 3.56166 2.3999 4.99462V19.0054C2.3999 20.4384 3.56154 21.6 4.9945 21.6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Calculator2 = memo(Calculator2Inner)
Calculator2.displayName = 'Calculator2'