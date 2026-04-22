import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const SnowflakeInner = forwardRef<SVGSVGElement, IconProps>(
  function Snowflake({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.81131 21.2447L11.9991 18.0568M11.9991 18.0568L15.1869 21.2447M11.9991 18.0568V5.94318M15.1869 2.75537L11.9991 5.94318M11.9991 5.94318L8.81131 2.75537M2.3999 13.8616L6.75453 15.0285M6.75453 15.0285L5.58771 19.3831M6.75453 15.0285L17.2453 8.97163M21.5999 10.1384L17.2453 8.97163M17.2453 8.97163L18.4121 4.617M5.58771 4.617L6.75453 8.97163M6.75453 8.97163L2.3999 10.1384M6.75453 8.97163L17.2453 15.0285M18.4121 19.3831L17.2453 15.0285M17.2453 15.0285L21.5999 13.8616" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Snowflake = memo(SnowflakeInner)
Snowflake.displayName = 'Snowflake'