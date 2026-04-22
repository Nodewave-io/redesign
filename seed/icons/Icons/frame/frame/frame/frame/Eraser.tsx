import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const EraserInner = forwardRef<SVGSVGElement, IconProps>(
  function Eraser({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M19.6783 21.3413H7.24862L2.72873 16.8214C2.51828 16.6097 2.40015 16.3233 2.40015 16.0248C2.40015 15.7263 2.51828 15.4399 2.72873 15.2282L14.0284 3.92844C14.2402 3.71798 14.5266 3.59985 14.8251 3.59985C15.1236 3.59985 15.41 3.71798 15.6217 3.92844L21.2716 9.5783C21.482 9.79001 21.6001 10.0764 21.6001 10.3749C21.6001 10.6735 21.482 10.9598 21.2716 11.1716L17.4001 15.043M11.1018 21.3413L17.4001 15.043M9.91192 8.04496L17.4001 15.043" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Eraser = memo(EraserInner)
Eraser.displayName = 'Eraser'