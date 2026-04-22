import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const RulerInner = forwardRef<SVGSVGElement, IconProps>(
  function Ruler({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.95549 17.9864L8.11344 16.1444M12.7185 15.2234L10.8765 13.3813M15.4816 12.4603L13.6396 10.6183M18.2447 9.69723L16.4026 7.85519M8.32411 21.2185L21.2184 8.32423C21.7271 7.81556 21.7271 6.99085 21.2184 6.48219L17.5177 2.78152C17.0091 2.27286 16.1844 2.27286 15.6757 2.78152L2.7814 15.6758C2.27274 16.1845 2.27274 17.0092 2.7814 17.5179L6.48207 21.2185C6.99073 21.7272 7.81544 21.7272 8.32411 21.2185Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Ruler = memo(RulerInner)
Ruler.displayName = 'Ruler'