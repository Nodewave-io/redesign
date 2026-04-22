import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const CodeInner = forwardRef<SVGSVGElement, IconProps>(
  function Code({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M9.5999 15L6.5999 12L9.5999 9.00002M14.3999 9.00002L17.3999 12L14.3999 15M4.7999 21.6C3.47442 21.6 2.3999 20.5255 2.3999 19.2V4.80002C2.3999 3.47454 3.47442 2.40002 4.7999 2.40002H19.1999C20.5254 2.40002 21.5999 3.47454 21.5999 4.80002V19.2C21.5999 20.5255 20.5254 21.6 19.1999 21.6H4.7999Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
)

export const Code = memo(CodeInner)
Code.displayName = 'Code'