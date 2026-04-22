import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const DropInner = forwardRef<SVGSVGElement, IconProps>(
  function Drop({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.6 14.3999C15.0643 16.0763 13.7176 17.4167 12 17.9999M12.0001 21.5999C8.03005 21.5999 4.80005 18.5578 4.80005 14.8186C4.80005 9.5999 12.0002 2.3999 12.0002 2.3999C12.0002 2.3999 19.2 9.5999 19.2 14.8186C19.2 18.5579 15.9702 21.5999 12.0001 21.5999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Drop = memo(DropInner)
Drop.displayName = 'Drop'