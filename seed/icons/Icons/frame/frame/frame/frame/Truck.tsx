import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const TruckInner = forwardRef<SVGSVGElement, IconProps>(
  function Truck({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M5.14276 17.0285H4.22847C3.21858 17.0285 2.3999 16.2099 2.3999 15.2V6.97139C2.3999 5.9615 3.21858 5.14282 4.22847 5.14282H12.457C13.4669 5.14282 14.2856 5.9615 14.2856 6.97139V15.2C14.2856 16.2099 13.4669 17.0285 12.457 17.0285H11.5428M15.657 17.0285H15.1999C14.695 17.0285 14.2856 16.6192 14.2856 16.1142V8.34282C14.2856 7.83788 14.695 7.42854 15.1999 7.42854H17.5033C17.7811 7.42854 18.0438 7.55479 18.2173 7.77167L21.3995 11.7495C21.5292 11.9116 21.5999 12.1131 21.5999 12.3207V16.1142C21.5999 16.6192 21.1906 17.0285 20.6856 17.0285M10.6285 16.5714C10.6285 17.8338 9.60512 18.8571 8.34276 18.8571C7.08039 18.8571 6.05704 17.8338 6.05704 16.5714C6.05704 15.309 7.08039 14.2857 8.34276 14.2857C9.60512 14.2857 10.6285 15.309 10.6285 16.5714ZM20.2285 16.5714C20.2285 17.8338 19.2051 18.8571 17.9428 18.8571C16.6804 18.8571 15.657 17.8338 15.657 16.5714C15.657 15.309 16.6804 14.2857 17.9428 14.2857C19.2051 14.2857 20.2285 15.309 20.2285 16.5714Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Truck = memo(TruckInner)
Truck.displayName = 'Truck'