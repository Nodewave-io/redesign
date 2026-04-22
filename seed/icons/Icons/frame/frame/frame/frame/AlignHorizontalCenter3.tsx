import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const AlignHorizontalCenter3Inner = forwardRef<SVGSVGElement, IconProps>(
  function AlignHorizontalCenter3({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M2.3999 11.9997L21.5999 11.9997M9.38272 5.11997L12.0009 2.3999M12.0009 2.3999L14.6191 5.11997M12.0009 2.3999V9.11458M14.619 18.9948L12.0009 21.7148M12.0009 21.7148L9.38268 18.9948M12.0009 21.7148V15.0002" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const AlignHorizontalCenter3 = memo(AlignHorizontalCenter3Inner)
AlignHorizontalCenter3.displayName = 'AlignHorizontalCenter3'