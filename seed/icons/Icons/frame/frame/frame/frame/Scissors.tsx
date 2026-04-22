import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const ScissorsInner = forwardRef<SVGSVGElement, IconProps>(
  function Scissors({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.04385 9.24393L19.9345 18.9428M19.9345 5.7918L8.04385 15.4906M17.1948 12.3677L17.1734 12.3892M21.5999 12.3677L21.5784 12.3892M5.68764 10.1755C3.87187 10.1755 2.3999 8.70348 2.3999 6.88771C2.3999 5.07195 3.87187 3.59998 5.68764 3.59998C7.50341 3.59998 8.97538 5.07195 8.97538 6.88771C8.97538 8.70348 7.50341 10.1755 5.68764 10.1755ZM5.68764 21.1346C3.87187 21.1346 2.3999 19.6626 2.3999 17.8468C2.3999 16.0311 3.87187 14.5591 5.68764 14.5591C7.50341 14.5591 8.97538 16.0311 8.97538 17.8468C8.97538 19.6626 7.50341 21.1346 5.68764 21.1346Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Scissors = memo(ScissorsInner)
Scissors.displayName = 'Scissors'