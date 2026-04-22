import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Pointer2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Pointer2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.2961 18.1449L18.444 21.1339C19.5964 21.6942 20.8256 20.5223 20.3209 19.3445L13.5257 3.48666C13.0529 2.38349 11.496 2.36408 10.9959 3.45512L3.69343 19.387C3.15979 20.5512 4.35798 21.7532 5.5239 21.2232L12.2961 18.1449Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Pointer2 = memo(Pointer2Inner)
Pointer2.displayName = 'Pointer2'