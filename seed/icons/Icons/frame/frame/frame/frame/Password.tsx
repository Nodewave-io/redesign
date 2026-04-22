import { forwardRef, memo } from 'react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** Icon size (default: 24) */
  size?: number
  /** Icon color (default: currentColor) */
  color?: string
}

const PasswordInner = forwardRef<SVGSVGElement, IconProps>(
  function Password({ size = 24, color = 'currentColor', ...props }: IconProps, ref) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} {...props}>
        <path d="M6.52879 12.0001H6.66882M11.9999 12.0001H12.1399M17.3294 12.0001H17.4694M2.3999 15.2668V8.73343C2.3999 7.55522 3.35503 6.6001 4.53324 6.6001H19.4666C20.6448 6.6001 21.5999 7.55522 21.5999 8.73343V15.2668C21.5999 16.445 20.6448 17.4001 19.4666 17.4001H4.53324C3.35503 17.4001 2.3999 16.445 2.3999 15.2668Z" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
)

export const Password = memo(PasswordInner)
Password.displayName = 'Password'