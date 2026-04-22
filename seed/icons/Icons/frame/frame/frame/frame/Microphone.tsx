import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MicrophoneInner = forwardRef<SVGSVGElement, IconProps>(
  function Microphone({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M4.39795 11.177C4.66378 13.0035 5.57833 14.6733 6.9743 15.8808C8.37026 17.0883 10.1543 17.7528 12.0001 17.7528M12.0001 17.7528C13.8458 17.7528 15.6298 17.0883 17.0258 15.8808C18.4218 14.6733 19.3363 13.0035 19.6022 11.177M12.0001 17.7528V21.5999M12.0011 2.3999C11.1282 2.3999 10.291 2.74668 9.67376 3.36394C9.05649 3.9812 8.70972 4.81839 8.70972 5.69133V10.0799C8.70972 10.9528 9.05649 11.79 9.67376 12.4073C10.291 13.0246 11.1282 13.3713 12.0011 13.3713C12.8741 13.3713 13.7113 13.0246 14.3285 12.4073C14.9458 11.79 15.2926 10.9528 15.2926 10.0799V5.69133C15.2926 4.81839 14.9458 3.9812 14.3285 3.36394C13.7113 2.74668 12.8741 2.3999 12.0011 2.3999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Microphone = memo(MicrophoneInner)
Microphone.displayName = 'Microphone'