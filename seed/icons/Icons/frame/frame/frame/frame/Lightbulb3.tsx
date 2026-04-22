import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Lightbulb3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Lightbulb3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M14.4 15.0001V19.2001C14.4 19.8628 13.8627 20.4001 13.2 20.4001H10.8C10.1373 20.4001 9.6 19.8628 9.6 19.2001V15.0001M18 9.6001C18 12.9138 15.3137 15.6001 12 15.6001C8.68629 15.6001 6 12.9138 6 9.6001C6 6.28639 8.68629 3.6001 12 3.6001C15.3137 3.6001 18 6.28639 18 9.6001Z" stroke={color} strokeWidth="2"/>
      </svg>
    )
  }
)

export const Lightbulb3 = memo(Lightbulb3Inner)
Lightbulb3.displayName = 'Lightbulb3'