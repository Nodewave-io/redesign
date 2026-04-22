import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const MicrophoneOffInner = forwardRef<SVGSVGElement, IconProps>(
  function MicrophoneOff({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.17586 3.36394C9.79312 2.74668 10.6303 2.3999 11.5032 2.3999C12.3762 2.3999 13.2134 2.74668 13.8306 3.36394C14.4479 3.9812 14.7947 4.81839 14.7947 5.69133V8.9999M3.90005 11.177C4.16588 13.0035 5.08043 14.6733 6.4764 15.8808C7.87236 17.0883 9.6564 17.7528 11.5022 17.7528M11.5022 17.7528C13.3479 17.7528 15.1319 17.0883 16.5279 15.8808C17.9239 14.6733 18.8384 13.0035 19.1043 11.177M11.5022 17.7528V21.5999M8.21182 7.7999V10.0799C8.21182 10.9528 8.55859 11.79 9.17586 12.4073C9.79312 13.0246 10.6303 13.3713 11.5032 13.3713C12.0618 13.3713 12.6056 13.2294 13.0866 12.9655M3.30005 2.3999L20.7 19.7999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const MicrophoneOff = memo(MicrophoneOffInner)
MicrophoneOff.displayName = 'MicrophoneOff'