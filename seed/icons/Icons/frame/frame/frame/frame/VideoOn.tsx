import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const VideoOnInner = forwardRef<SVGSVGElement, IconProps>(
  function VideoOn({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M12.1055 8.83333H9.3555M15.8752 14.3867L20.5252 16.6771C21.0072 16.9705 21.513 16.7976 21.5 16.1856L21.4674 8.09104C21.4262 7.42667 21.0341 7.24539 20.4568 7.55242L15.8621 9.64057M5.25 18.5H13.6055C14.8481 18.5 15.8555 17.5051 15.8555 16.2778L15.8752 13.4275L15.8555 7.72222C15.8555 6.49492 14.8481 5.5 13.6055 5.5H5.25C4.00736 5.5 3 6.49492 3 7.72222V16.2778C3 17.5051 4.00736 18.5 5.25 18.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const VideoOn = memo(VideoOnInner)
VideoOn.displayName = 'VideoOn'