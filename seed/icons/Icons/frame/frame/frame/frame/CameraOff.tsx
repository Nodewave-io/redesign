import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CameraOffInner = forwardRef<SVGSVGElement, IconProps>(
  function CameraOff({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 7.98019V17.8202C2.3999 19.1457 3.47442 20.2202 4.7999 20.2202H14.3999M5.9999 5.5802H7.1999L8.8799 2.7002H15.1199L16.7999 5.5802H19.1999C20.5254 5.5802 21.5999 6.65471 21.5999 7.9802V17.8202C21.5999 18.7085 21.1173 19.4841 20.3999 19.8991M14.6832 14.7002C15.2533 14.0633 15.5999 13.2222 15.5999 12.3002C15.5999 10.312 13.9881 8.70019 11.9999 8.70019C11.0779 8.70019 10.2368 9.04682 9.5999 9.61687M11.3999 15.8504C9.84265 15.5892 8.62441 14.3281 8.42772 12.7499M20.9999 21.3002L2.9999 2.7002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CameraOff = memo(CameraOffInner)
CameraOff.displayName = 'CameraOff'