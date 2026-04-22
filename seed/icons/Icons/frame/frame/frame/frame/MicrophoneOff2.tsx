import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MicrophoneOff2Inner = forwardRef<SVGSVGElement, IconProps>(
  function MicrophoneOff2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.7921 6.51608V12.0043C7.7921 13.096 8.22576 14.143 8.9977 14.9149C9.76963 15.6868 10.8166 16.1205 11.9083 16.1205C13 16.1205 14.0469 15.6868 14.8189 14.9149C15.034 14.6998 15.2228 14.4633 15.3833 14.2104M2.3999 13.3764C2.73234 15.6606 3.87606 17.7487 5.62182 19.2588C7.36758 20.7688 9.59866 21.5999 11.9069 21.5999C14.2152 21.5999 16.4462 20.7688 18.192 19.2588C19.9378 17.7487 21.0815 15.6606 21.4139 13.3764M16.0245 8.9999V6.51608C16.0245 5.4244 15.5908 4.37744 14.8189 3.6055C14.0469 2.83357 13 2.3999 11.9083 2.3999C11.1472 2.3999 10.4079 2.61068 9.7683 2.9999M4.1999 2.3999L21.5999 19.7999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MicrophoneOff2 = memo(MicrophoneOff2Inner)
MicrophoneOff2.displayName = 'MicrophoneOff2'