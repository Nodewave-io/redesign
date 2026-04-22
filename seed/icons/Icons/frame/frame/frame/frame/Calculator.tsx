import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CalculatorInner = forwardRef<SVGSVGElement, IconProps>(
  function Calculator({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.375 17.625L17.625 6.375M8.25 10.75V8.25M8.25 8.25V5.75M8.25 8.25H5.75M8.25 8.25H10.75M13.25 16.375H18.25M4.7027 22H19.2973C20.79 22 22 20.79 22 19.2973V4.7027C22 3.21004 20.79 2 19.2973 2H4.7027C3.21004 2 2 3.21004 2 4.7027V19.2973C2 20.79 3.21004 22 4.7027 22Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Calculator = memo(CalculatorInner)
Calculator.displayName = 'Calculator'