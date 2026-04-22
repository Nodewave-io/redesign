import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Sun3Inner = forwardRef<SVGSVGElement, IconProps>(
  function Sun3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9999 5.51342V2.3999M11.9999 21.5999V18.4864M18.4864 11.9999H21.5999M2.3999 11.9999H5.51342M16.5868 7.41348L18.7884 5.2119M5.21115 18.7881L7.41274 16.5866M16.5868 16.5863L18.7884 18.7879M5.21115 5.21166L7.41274 7.41325M15.5687 11.8733C15.5687 13.8616 13.9569 15.4733 11.9687 15.4733C9.98043 15.4733 8.36865 13.8616 8.36865 11.8733C8.36865 9.88512 9.98043 8.27334 11.9687 8.27334C13.9569 8.27334 15.5687 9.88512 15.5687 11.8733Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Sun3 = memo(Sun3Inner)
Sun3.displayName = 'Sun3'