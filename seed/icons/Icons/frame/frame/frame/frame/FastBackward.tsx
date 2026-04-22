import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FastBackwardInner = forwardRef<SVGSVGElement, IconProps>(
  function FastBackward({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.9188 12.4808L20.4388 19.0008C20.8673 19.4293 21.5999 19.1258 21.5999 18.5198L21.5999 5.47987C21.5999 4.87391 20.8673 4.57044 20.4388 4.99892L13.9188 11.5189C13.6532 11.7845 13.6532 12.2152 13.9188 12.4808Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.59912 12.4808L9.11909 19.0008C9.54757 19.4293 10.2802 19.1258 10.2802 18.5198L10.2802 5.47987C10.2802 4.87391 9.54757 4.57044 9.11909 4.99892L2.59912 11.5189C2.3335 11.7845 2.3335 12.2152 2.59912 12.4808Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const FastBackward = memo(FastBackwardInner)
FastBackward.displayName = 'FastBackward'