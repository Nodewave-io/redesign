import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const VideoOffInner = forwardRef<SVGSVGElement, IconProps>(
  function VideoOff({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M15.375 12.4683L19.9697 9.29195C20.547 8.97614 20.9391 9.16261 20.9803 9.84596L20.9998 16.494C21.0128 17.1235 20.5069 17.3013 20.0249 16.9996L15.375 13.6151V12.4683ZM15.375 12.4683V10.2857C15.375 9.02335 14.3676 8 13.125 8H12M7.5 8H5.25C4.00736 8 3 9.02335 3 10.2857V16C3 17.2624 4.00736 18.2857 5.25 18.2857H13.125C13.5972 18.2857 14.0353 18.138 14.3972 17.8855M16.5 20L4.6875 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const VideoOff = memo(VideoOffInner)
VideoOff.displayName = 'VideoOff'