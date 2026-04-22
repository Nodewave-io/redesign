import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const Cursor2Inner = forwardRef<SVGSVGElement, IconProps>(
  function Cursor2({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M13.3324 13.311L20.4001 20.4M12.94 12.9168L18.5418 11.0743C19.5919 10.7289 19.5974 9.24276 18.5504 8.80503L5.23765 3.69904C4.2569 3.28904 3.30275 4.22154 3.68732 5.21418L8.51774 18.9216C8.92811 19.9808 10.41 20.013 10.7816 18.9707L12.94 12.9168Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Cursor2 = memo(Cursor2Inner)
Cursor2.displayName = 'Cursor2'