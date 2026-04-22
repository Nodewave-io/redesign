import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AudioSettingsInner = forwardRef<SVGSVGElement, IconProps>(
  function AudioSettings({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 4.7999L11.9999 4.7999M2.3999 11.9999H11.9999M11.9999 11.9999V14.3999M11.9999 11.9999V9.5999M2.3999 19.1999H7.1999M11.9999 19.1999L21.5999 19.1999M16.7999 11.9999H21.5999M16.7999 4.7999L21.5999 4.7999M16.7999 4.7999V7.1999M16.7999 4.7999V2.3999M7.7999 21.5999V16.7999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AudioSettings = memo(AudioSettingsInner)
AudioSettings.displayName = 'AudioSettings'