import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PlugInner = forwardRef<SVGSVGElement, IconProps>(
  function Plug({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M11.9811 17.6272V21.6999M8.49018 4.24539V2.49994M15.472 4.24539V2.49994M18.9629 8.31812H4.99927M6.74472 8.31812H17.2175V12.9727C17.2175 15.5433 15.1335 17.6272 12.5629 17.6272H11.3993C8.82863 17.6272 6.74472 15.5433 6.74472 12.9727V8.31812Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Plug = memo(PlugInner)
Plug.displayName = 'Plug'