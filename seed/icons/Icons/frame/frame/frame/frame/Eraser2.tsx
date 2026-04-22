import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Eraser2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Eraser2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M3.6001 21.6H21.2001M11.3351 18.1702H7.91004L3.89237 14.1525C3.7053 13.9643 3.6003 13.7097 3.6003 13.4444C3.6003 13.179 3.7053 12.9245 3.89237 12.7363L13.9365 2.6921C14.1247 2.50503 14.3793 2.40002 14.6447 2.40002C14.91 2.40002 15.1646 2.50503 15.3528 2.6921L20.3748 7.71418C20.5619 7.90237 20.6669 8.15694 20.6669 8.4223C20.6669 8.68765 20.5619 8.94222 20.3748 9.13041L11.3351 18.1702Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Eraser2 = memo(Eraser2Inner)
Eraser2.displayName = 'Eraser2'