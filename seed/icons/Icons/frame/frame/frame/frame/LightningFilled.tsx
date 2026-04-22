import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LightningFilledInner = forwardRef<SVGSVGElement, IconProps>(
  function LightningFilled({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.28905 13.6318L12.2782 2.64879C12.5468 2.22677 13.2 2.417 13.2 2.91722V10.7002C13.2 10.7554 13.2448 10.8002 13.3 10.8002H18.2397C18.6442 10.8002 18.8813 11.2555 18.6493 11.5869L11.7097 21.5007C11.4293 21.9012 10.8 21.7029 10.8 21.214V14.5002C10.8 14.445 10.7553 14.4002 10.7 14.4002H5.71089C5.31634 14.4002 5.07723 13.9646 5.28905 13.6318Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const LightningFilled = memo(LightningFilledInner)
LightningFilled.displayName = 'LightningFilled'