import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CameraLensInner = forwardRef<SVGSVGElement, IconProps>(
  function CameraLens({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M7.7999 10.1999L10.7993 8.07175L17.3999 2.9999M11.9999 7.1999L20.9999 13.1999M16.1999 10.7999L13.1999 20.9999M14.3999 15.5999H2.9999M9.5999 15.5999L4.7999 2.9999M7.1999 21.5999H16.7999C19.4509 21.5999 21.5999 19.4509 21.5999 16.7999V7.1999C21.5999 4.54894 19.4509 2.3999 16.7999 2.3999H7.1999C4.54894 2.3999 2.3999 4.54894 2.3999 7.1999V16.7999C2.3999 19.4509 4.54894 21.5999 7.1999 21.5999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const CameraLens = memo(CameraLensInner)
CameraLens.displayName = 'CameraLens'