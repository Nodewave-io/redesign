import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const FaceIdInner = forwardRef<SVGSVGElement, IconProps>(
  function FaceId({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M8.7999 2.3999H4.53324C3.35503 2.3999 2.3999 3.35503 2.3999 4.53324V8.7999M8.7999 21.5999H4.53324C3.35503 21.5999 2.3999 20.6448 2.3999 19.4666V15.1999M15.1999 2.3999H19.4666C20.6448 2.3999 21.5999 3.35503 21.5999 4.53324V8.7999M21.5999 15.1999V19.4666C21.5999 20.6448 20.6448 21.5999 19.4666 21.5999H15.1999M7.7999 9.16513V7.99514M16.1999 9.16513V7.99514M8.65256 15.6001C10.0207 16.6602 13.0888 16.6602 15.0006 15.6001M11.3999 12.6751L11.6484 12.4328C11.8735 12.2134 11.9999 11.9158 11.9999 11.6055V8.58014" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const FaceId = memo(FaceIdInner)
FaceId.displayName = 'FaceId'