import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Logout4Inner = forwardRef<SVGSVGElement, IconProps>(
  function Logout4({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.6471 7.8001V5.7001C14.6471 5.14314 14.424 4.609 14.0268 4.21517C13.6297 3.82135 13.091 3.6001 12.5294 3.6001H5.11765C4.55601 3.6001 4.01738 3.82135 3.62024 4.21517C3.22311 4.609 3 5.14314 3 5.7001V18.3001C3 18.8571 3.22311 19.3912 3.62024 19.785C4.01738 20.1788 4.55601 20.4001 5.11765 20.4001H12.5294C13.091 20.4001 13.6297 20.1788 14.0268 19.785C14.424 19.3912 14.6471 18.8571 14.6471 18.3001V16.2001M8.29412 12.0001H21M21 12.0001L17.8235 8.8501M21 12.0001L17.8235 15.1501" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Logout4 = memo(Logout4Inner)
Logout4.displayName = 'Logout4'