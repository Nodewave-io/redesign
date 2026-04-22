import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const LightningInner = forwardRef<SVGSVGElement, IconProps>(
  function Lightning({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M10.2222 14.4888L9.51105 21.5999L18.7555 11.6443L13.7777 8.7999L14.4888 2.3999L5.24438 12.3555L10.2222 14.4888Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Lightning = memo(LightningInner)
Lightning.displayName = 'Lightning'